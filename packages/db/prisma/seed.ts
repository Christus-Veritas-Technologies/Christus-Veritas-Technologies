import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@cvt.co.zw" },
    update: {},
    create: {
      email: "admin@cvt.co.zw",
      name: "CVT Admin",
      isAdmin: true,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created admin user:", adminUser.email);

  // Create a sample organization
  const sampleOrg = await prisma.organization.upsert({
    where: { slug: "sample-retailer" },
    update: {},
    create: {
      name: "Sample Retailer",
      slug: "sample-retailer",
      email: "sample@example.com",
      phone: "+263 77 123 4567",
      address: "123 Main Street",
      city: "Harare",
      country: "Zimbabwe",
    },
  });

  console.log("✅ Created sample organization:", sampleOrg.name);

  // Create billing account for the organization
  const billingAccount = await prisma.billingAccount.upsert({
    where: { organizationId: sampleOrg.id },
    update: {},
    create: {
      organizationId: sampleOrg.id,
      status: "ACTIVE",
      gracePeriodDays: 14,
    },
  });

  console.log("✅ Created billing account for:", sampleOrg.name);

  // Create a sample service
  const service = await prisma.service.upsert({
    where: { id: "sample-pos-service" },
    update: {},
    create: {
      id: "sample-pos-service",
      organizationId: sampleOrg.id,
      type: "POS_TERMINAL",
      name: "POS Terminal #1",
      hardwareSerial: "CVT-POS-000001",
      monthlyFee: 2000, // $20.00 in cents
      status: "ACTIVE",
    },
  });

  console.log("✅ Created sample service:", service.name);

  // Create default system settings
  const settings = [
    { key: "billing.gracePeriodDays", value: "14" },
    { key: "billing.suspensionDays", value: "30" },
    { key: "billing.taxRate", value: "0" },
    { key: "billing.invoicePrefix", value: "INV" },
  ];

  for (const setting of settings) {
    await prisma.systemSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log("✅ Created system settings");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
