import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class NewsUpdatesService {
  constructor(private prisma: PrismaService) {}

  // Create a news update
  async createNewsUpdate(data: {
    title: string;
    content: string;
    title_kannada?: string;
    content_kannada?: string;
    created_by: number;
    imageIds: number[];
  }) {
    const {
      title,
      content,
      title_kannada,
      content_kannada,
      created_by,
      imageIds,
    } = data;

    return this.prisma.newsUpdates.create({
      data: {
        title,
        content,
        title_kannada,
        content_kannada,
        created_by,
        NewsImages: {
          create: imageIds.map((id) => ({ image_id: id })),
        },
      },
      include: {
        NewsImages: {
          include: {
            Images: true,
          },
        },
      },
    });
  }

  // Update a news update
  async updateNewsUpdate(
    newsId: number,
    data: {
      title?: string;
      content?: string;
      title_kannada?: string;
      content_kannada?: string;
      updated_by: number;
      imageIds?: number[];
    },
  ) {
    const news = await this.prisma.newsUpdates.findUnique({
      where: { news_id: newsId },
    });

    if (!news) {
      throw new NotFoundException('News update not found');
    }

    const { title, content, title_kannada, content_kannada, imageIds } = data;

    return this.prisma.newsUpdates.update({
      where: { news_id: newsId },
      data: {
        title,
        content,
        title_kannada,
        content_kannada,
        updated_at: new Date(),
        NewsImages: imageIds
          ? {
              deleteMany: {},
              create: imageIds.map((id) => ({ image_id: id })),
            }
          : undefined,
      },
      include: {
        NewsImages: {
          include: {
            Images: true,
          },
        },
      },
    });
  }

  // Delete a news update
  async deleteNewsUpdate(newsId: number) {
    const news = await this.prisma.newsUpdates.findUnique({
      where: { news_id: newsId },
    });

    if (!news) {
      throw new NotFoundException('News update not found');
    }

    return this.prisma.newsUpdates.delete({
      where: { news_id: newsId },
    });
  }

  // Get a single news update by ID
  async getNewsUpdateById(newsId: number) {
    const news = await this.prisma.newsUpdates.findUnique({
      where: { news_id: newsId },
      include: {
        NewsImages: {
          include: {
            Images: true,
          },
        },
      },
    });

    if (!news) {
      throw new NotFoundException('News update not found');
    }

    return news;
  }

  // Get all news updates
  async getAllNewsUpdates() {
    return this.prisma.newsUpdates.findMany({
      include: {
        NewsImages: {
          include: {
            Images: true,
          },
        },
      },
    });
  }
}
