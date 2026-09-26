import { Container } from './Container'

type PageHeaderProps = {
  kicker: string
  title: string
  description: string
}

export function PageHeader({ kicker, title, description }: PageHeaderProps) {
  return (
    <header className="page-header">
      <Container>
        <p className="kicker">{kicker}</p>
        <h1>{title}</h1>
        <p>{description}</p>
        <hr className="page-header__rule" />
      </Container>
    </header>
  )
}
