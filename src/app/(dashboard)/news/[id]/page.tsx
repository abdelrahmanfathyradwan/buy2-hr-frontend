import { NewsDetail } from "@/features/news/components/NewsDetail";

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <NewsDetail id={id} />;
}
