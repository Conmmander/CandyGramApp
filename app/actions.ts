"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function submitValentine(formData: FormData) {
  const imageData = formData.get("imageData") as string;
  const building = formData.get("building") as string;

  // Validate both fields
  if (!imageData || !building) {
    return { error: "Please draw something and select a building!" };
  }

  try {
    await prisma.valentine.create({
      data: {
        imageData,
        building,
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    console.error(e);
    return { error: "Failed to submit valentine" };
  }
}

export async function getValentines() {
  return await prisma.valentine.findMany({
    orderBy: [
      { building: "asc" }, // Groups them by building automatically
      { createdAt: "desc" },
    ],
  });
}

export async function deleteValentine(id: string) {
  try {
    await prisma.valentine.delete({
      where: { id },
    });
    revalidatePath("/admin");
    return { success: true };
  } catch (e) {
    return { error: "Failed to delete" };
  }
}

export async function verifyAdminPassword(input: string) {
  // Define your password here or in .env (Recommended)
  const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
  return { success: input === CORRECT_PASSWORD };
}
