import ChatPageClient from "./ChatPageClient"

export default function Page({ params }: { params: { id: string } }) {
  return <ChatPageClient id={params.id} />
}
