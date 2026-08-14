import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q") ?? "";
  const excludeId = searchParams.get("excludeId") ?? undefined;

  try {
    const users = await prisma.user.findMany({
      where: {
        AND: [
          excludeId ? { id: { not: excludeId } } : {},
          query
            ? {
                OR: [
                  { name: { contains: query, mode: "insensitive" } },
                  { email: { contains: query, mode: "insensitive" } },
                ],
              }
            : {},
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    let messagesByOtherUser: Record<
      string,
      { content: string; createdAt: Date; senderId: string }
    > = {};

    if (excludeId) {
      const recentMessages = await prisma.message.findMany({
        where: {
          chatId: {
            contains: excludeId,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      for (const msg of recentMessages) {
        const parts = msg.chatId.split("_vs_");
        const otherId = parts.find((id) => id !== excludeId);
        if (otherId && !messagesByOtherUser[otherId]) {
          messagesByOtherUser[otherId] = {
            content: msg.content,
            createdAt: msg.createdAt,
            senderId: msg.senderId,
          };
        }
      }
    }

    const usersWithLastMessage = users.map((user) => ({
      ...user,
      lastMessage: messagesByOtherUser[user.id] || null,
    }));

    usersWithLastMessage.sort((a, b) => {
      const timeA = a.lastMessage
        ? new Date(a.lastMessage.createdAt).getTime()
        : 0;
      const timeB = b.lastMessage
        ? new Date(b.lastMessage.createdAt).getTime()
        : 0;

      if (timeA !== timeB) {
        return timeB - timeA;
      }
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json(usersWithLastMessage);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

