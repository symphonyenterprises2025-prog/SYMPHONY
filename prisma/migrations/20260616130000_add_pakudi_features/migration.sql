-- Create _ProductCategories join table for M:N Product <-> Category
CREATE TABLE "_ProductCategories" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_ProductCategories_AB_unique" ON "_ProductCategories"("A", "B");
CREATE INDEX "_ProductCategories_B_index" ON "_ProductCategories"("B");

ALTER TABLE "_ProductCategories"
    ADD CONSTRAINT "_ProductCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "_ProductCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Migrate existing categoryId data to join table
INSERT INTO "_ProductCategories" ("A", "B")
SELECT "categoryId", "id" FROM "products" WHERE "categoryId" IS NOT NULL;

-- Drop old categoryId column and FK
ALTER TABLE "products" DROP CONSTRAINT "products_categoryId_fkey";
ALTER TABLE "products" DROP COLUMN "categoryId";

-- Add new columns to products
ALTER TABLE "products"
    ADD COLUMN "hasCustomization" BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN "customizationLabel" TEXT,
    ADD COLUMN "socialProofLine1" TEXT,
    ADD COLUMN "socialProofLine2" TEXT;

-- Add customization to cart_items
ALTER TABLE "cart_items" ADD COLUMN "customization" JSONB;

-- Add customization and addOns to order_items
ALTER TABLE "order_items"
    ADD COLUMN "customization" JSONB,
    ADD COLUMN "addOns" JSONB;

-- Create add_ons table
CREATE TABLE "add_ons" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DECIMAL(10,2) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "add_ons_pkey" PRIMARY KEY ("id")
);

-- Create _ProductAddOns join table for M:N AddOn <-> Product
CREATE TABLE "_ProductAddOns" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

CREATE UNIQUE INDEX "_ProductAddOns_AB_unique" ON "_ProductAddOns"("A", "B");
CREATE INDEX "_ProductAddOns_B_index" ON "_ProductAddOns"("B");

ALTER TABLE "_ProductAddOns"
    ADD CONSTRAINT "_ProductAddOns_A_fkey" FOREIGN KEY ("A") REFERENCES "add_ons"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "_ProductAddOns_B_fkey" FOREIGN KEY ("B") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Create cart_item_add_ons table
CREATE TABLE "cart_item_add_ons" (
    "id" TEXT NOT NULL,
    "cartItemId" TEXT NOT NULL,
    "addOnId" TEXT NOT NULL,
    "price" DECIMAL(10,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "cart_item_add_ons_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "cart_item_add_ons"
    ADD CONSTRAINT "cart_item_add_ons_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "cart_items"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT "cart_item_add_ons_addOnId_fkey" FOREIGN KEY ("addOnId") REFERENCES "add_ons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Create user_coupons table
CREATE TABLE "user_coupons" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "discountType" "DiscountType" NOT NULL,
    "discountValue" DECIMAL(10,2) NOT NULL,
    "description" TEXT,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "usedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "user_coupons_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "user_coupons_code_key" ON "user_coupons"("code");

ALTER TABLE "user_coupons"
    ADD CONSTRAINT "user_coupons_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
