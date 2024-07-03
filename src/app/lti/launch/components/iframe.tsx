import { memo } from "react"

const IframeEmbedLink = ({ embedLink }: { embedLink: string }) => {
  return (
    <iframe height={300} src={embedLink} />
  )
}

const IframeLink = memo(IframeEmbedLink);
export default IframeLink;