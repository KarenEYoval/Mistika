import { ProductPage } from "@/views/ProductPage";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export default async function Page({ params }: Props) {
  const id = Number(params.id);
  if (!Number.isFinite(id)) notFound();

  return <ProductPage id={id} />;
}
