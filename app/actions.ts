"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const prisma = new PrismaClient();

export async function submitValentine(formData: FormData) {
  const imageData = formData.get("imageData") as string;

  if (!imageData) {
    return { error: "Please draw something!" };
  }

  try {
    await prisma.valentine.create({
      data: { imageData },
    });

    revalidatePath("/");
    return { success: true };
  } catch (e) {
    return { error: "Failed to submit valentine" };
  }
}

export async function getValentines() {
  return await prisma.valentine.findMany({
    orderBy: { createdAt: "desc" },
  });
}
