"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function submitValentine(formData: FormData) {
  const to = formData.get("to") as string;
  const from = formData.get("from") as string;
  const imageData = formData.get("imageData") as string;

  // Simple validation
  if (!to || !from || !imageData) {
    return { error: "Please fill out all fields and draw something!" };
  }

  try {
    // Save to database
    await prisma.valentine.create({
      data: {
        to,
        from,
        imageData,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to submit valentine" };
  }
}

// Fetch function for the Admin page
export async function getValentines() {
  const valentines = await prisma.valentine.findMany({
    orderBy: { createdAt: "desc" },
  });
  return valentines;
}
