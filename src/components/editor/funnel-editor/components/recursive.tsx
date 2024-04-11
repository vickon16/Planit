import { TEditorElement } from '@/hooks/use-editor'
import Container from './container'
import TextComponent from './text-component'
import TwoContainers from './two-containers'
import LinkComponent from './link-component'
import VideoComponent from './video-component'
import ContactFormComponent from './contact-form-component'
import ButtonComponent from './button-component'
import ThreeContainers from './three-containers'
import ImageComponent from './image-component'

type Props = {
  element: TEditorElement
}

const Recursive = ({ element }: Props) => {
  switch (element.type) {
    case 'text':
      return <TextComponent element={element} />
    case 'button':
      return <ButtonComponent element={element} />
    case 'container':
      return <Container element={element} />
    case 'video':
      return <VideoComponent element={element} />
    case 'contactForm':
      return <ContactFormComponent element={element} />
    case '2Col':
      return <TwoContainers element={element} />
    case "3Col":
      return <ThreeContainers element={element} />;
    case 'link':
      return <LinkComponent element={element} />
    case 'image':
      return <ImageComponent element={element} />

    default:
      return null
  }
}

export default Recursive
