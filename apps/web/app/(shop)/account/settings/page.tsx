import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StorefrontCanvas, StorefrontContainer } from "@/components/storefront/brand-system";

export default function SettingsPage() {
  return (
    <StorefrontCanvas>
      <SiteHeader />
      <main className="pb-16 pt-8">
        <StorefrontContainer>
          <Breadcrumbs items={[{ label: "My Account", href: "/account" }, { label: "Settings" }]} />
          <div className="mt-6">
            <h1 className="font-sans text-[2.6rem] font-semibold tracking-tight text-slate-950">Account Settings</h1>
            <p className="mt-2 font-sans text-[1rem] text-slate-600">Manage your account preferences and notifications</p>
            <div className="mt-8 rounded-[2rem] border border-[#eadfca] bg-white p-8 text-center shadow-[0_24px_60px_rgba(45,36,20,0.1)]">
              <p className="text-slate-500">Settings panel coming soon.</p>
            </div>
          </div>
        </StorefrontContainer>
      </main>
      <SiteFooter />
    </StorefrontCanvas>
  );
}
