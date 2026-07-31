const { PrismaClient } = require("@prisma/client");

async function importBcrypt() {
  try {
    return require("bcryptjs");
  } catch {
    return require("bcrypt");
  }
}

async function hashPassword(password) {
  const bcrypt = await importBcrypt();
  const hashFn =
    typeof bcrypt.hash === "function" ? bcrypt.hash.bind(bcrypt) : bcrypt.default.hash.bind(bcrypt.default);
  return hashFn(password, 10);
}

async function main() {
  const prisma = new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

  const created = {
    closingHours: 0,
    zones: 0,
    dishes: 0,
    variants: 0,
    riders: 0,
    admin: 0,
  };

  const days = [
    { dayOfWeek: 0, openTime: null, closeTime: null, isClosed: true },
    { dayOfWeek: 1, openTime: "09:00", closeTime: "20:00", isClosed: false },
    { dayOfWeek: 2, openTime: "09:00", closeTime: "20:00", isClosed: false },
    { dayOfWeek: 3, openTime: "09:00", closeTime: "20:00", isClosed: false },
    { dayOfWeek: 4, openTime: "09:00", closeTime: "20:00", isClosed: false },
    { dayOfWeek: 5, openTime: "09:00", closeTime: "20:00", isClosed: false },
    { dayOfWeek: 6, openTime: "09:00", closeTime: "20:00", isClosed: false },
  ];

  for (const day of days) {
    await prisma.closingHours.upsert({
      where: { dayOfWeek: day.dayOfWeek },
      update: day,
      create: day,
    });
    created.closingHours++;
  }

  const zones = [
    { code: "LDK-Z-ABJ-0001", name: "Maitama", city: "Abuja", deliveryFee: 2500 },
    { code: "LDK-Z-ABJ-0002", name: "Wuse", city: "Abuja", deliveryFee: 2000 },
    { code: "LDK-Z-ABJ-0003", name: "Garki", city: "Abuja", deliveryFee: 2000 },
    { code: "LDK-Z-PH-0001", name: "GRA", city: "Port Harcourt", deliveryFee: 3000 },
    { code: "LDK-Z-PH-0002", name: "Trans Amadi", city: "Port Harcourt", deliveryFee: 2500 },
  ];

  for (const zone of zones) {
    await prisma.zone.upsert({
      where: { code: zone.code },
      update: zone,
      create: zone,
    });
    created.zones++;
  }

  const dishes = [
    {
      code: "LDK-D-0001",
      name: "Jollof Rice",
      slug: "jollof-rice",
      description: "Smoky party-style jollof rice.",
      category: "Mains",
      photos: [],
      leadTimeHours: 24,
      minOrder: 1,
      abujaAvailable: true,
      phAvailable: true,
      variants: [
        { code: "LDK-V-0001", size: "1.5L", price: 6500 },
        { code: "LDK-V-0002", size: "2L", price: 8500 },
      ],
    },
    {
      code: "LDK-D-0002",
      name: "Peppered Chicken",
      slug: "peppered-chicken",
      description: "Spicy peppered chicken pieces.",
      category: "Sides",
      photos: [],
      leadTimeHours: 24,
      minOrder: 1,
      abujaAvailable: true,
      phAvailable: true,
      variants: [
        { code: "LDK-V-0003", size: "Piece", price: 2500 },
        { code: "LDK-V-0004", size: "6-piece pack", price: 13500 },
      ],
    },
    {
      code: "LDK-D-0003",
      name: "Coleslaw",
      slug: "coleslaw",
      description: "Creamy coleslaw.",
      category: "Sides",
      photos: [],
      leadTimeHours: 24,
      minOrder: 1,
      abujaAvailable: true,
      phAvailable: true,
      variants: [
        { code: "LDK-V-0005", size: "500ml", price: 2000 },
        { code: "LDK-V-0006", size: "1L", price: 3500 },
      ],
    },
  ];

  for (const dish of dishes) {
    const { variants, ...data } = dish;
    const createdDish = await prisma.dish.upsert({
      where: { code: dish.code },
      update: data,
      create: data,
    });

    for (const variant of variants) {
      await prisma.variant.upsert({
        where: { code: variant.code },
        update: { ...variant, dishId: createdDish.id },
        create: { ...variant, dishId: createdDish.id },
      });
      created.variants++;
    }
    created.dishes++;
  }

  const riderCode = "LDK-R-0001";
  const upsertedRider = await prisma.rider.upsert({
    where: { code: riderCode },
    update: { name: "Placeholder Rider", phone: "08000000000", isActive: true },
    create: { code: riderCode, name: "Placeholder Rider", phone: "08000000000", isActive: true },
  });
  created.riders += upsertedRider ? 1 : 0;

  const adminEmail = "admin@ladydkitchen.local";
  const passwordHash = await hashPassword("changeme123");
  const upsertedAdmin = await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { name: "Admin", passwordHash },
    create: { email: adminEmail, name: "Admin", passwordHash },
  });
  created.admin += upsertedAdmin ? 1 : 0;

  console.log("Seed completed:", created);
}

main()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
