"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Mail, Phone, Loader2 } from "lucide-react";

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
  orderEmail: string;
  orderName: string;
}

export function OrderActions({ orderId, currentStatus, orderEmail, orderName }: OrderActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">("success");

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const updateOrder = async () => {
    setUpdating(true);
    try {
      // Update status
      if (status !== currentStatus) {
        const statusRes = await fetch(`/api/orders/${orderId}/status`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        });
        if (!statusRes.ok) {
          const err = await statusRes.json();
          throw new Error(err.error || "Failed to update status");
        }
      }

      // Update notes via PUT to /api/orders/[id]
      if (notes) {
        const updateRes = await fetch(`/api/orders/${orderId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ notes, trackingNumber }),
        });
        if (!updateRes.ok) {
          const err = await updateRes.json();
          throw new Error(err.error || "Failed to update order");
        }
      }

      showMessage("Order updated successfully!", "success");
      router.refresh();
    } catch (err: any) {
      showMessage(err.message || "Failed to update order", "error");
    } finally {
      setUpdating(false);
    }
  };

  const sendEmail = async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: currentStatus, message: `Update on your order ${currentStatus}` }),
      });
      if (res.ok) {
        showMessage("Status email sent to customer!", "success");
      }
    } catch {
      showMessage("Failed to send email", "error");
    }
  };

  return (
    <>
      {message && (
        <div className={`p-3 rounded-lg text-sm font-medium ${
          messageType === "success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
        }`}>
          {message}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Update Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="status">Order Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="CONFIRMED">Confirmed</SelectItem>
                <SelectItem value="PROCESSING">Processing</SelectItem>
                <SelectItem value="SHIPPED">Shipped</SelectItem>
                <SelectItem value="DELIVERED">Delivered</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
                <SelectItem value="REFUNDED">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="tracking">Tracking Number</Label>
            <Input id="tracking" value={trackingNumber} onChange={(e) => setTrackingNumber(e.target.value)} placeholder="Enter tracking number" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Order Notes</Label>
            <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add internal notes..." rows={3} />
          </div>
          <Button className="w-full" onClick={updateOrder} disabled={updating}>
            {updating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...</> : "Update Order"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button variant="outline" className="w-full justify-start" onClick={sendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Send Status Email to Customer
          </Button>
          <a href={`tel:${orderEmail}`} className="block">
            <Button variant="outline" className="w-full justify-start">
              <Phone className="h-4 w-4 mr-2" />
              Call Customer
            </Button>
          </a>
        </CardContent>
      </Card>
    </>
  );
}
