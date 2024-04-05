import { TEditorElement } from '@/hooks/use-editor'
import Container from './container'
// import React from 'react'
// import TextComponent from './text'
// import VideoComponent from './video'
// import LinkComponent from './link-component'
// import ContactFormComponent from './contact-form-component'
// import Checkout from './checkout'

type Props = {
  element: TEditorElement
}

const Recursive = ({ element }: Props) => {
  console.log(element)
  switch (element.type) {
    case 'text':
      // return <TextComponent element={element} />
    case 'container':
      return <Container element={element} />
    case 'video':
      // return <VideoComponent element={element} />
    case 'contactForm':
      // return <ContactFormComponent element={element} />
    case 'paymentForm':
      // return <Checkout element={element} />
    case '2Col':
      return <Container element={element} />
    case '__body':
      return <Container element={element} />

    case 'link':
      // return <LinkComponent element={element} />
    default:
      return null
  }
}

export default Recursive
