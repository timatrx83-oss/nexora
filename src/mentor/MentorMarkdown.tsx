import type { ReactNode } from 'react'

function escapeHtml(value: string) {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
}

function inline(value: string) {
  return escapeHtml(value)
    .replaceAll(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replaceAll(/`([^`]+)`/g, '<code>$1</code>')
}

export function MentorMarkdown({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/)
  const nodes: ReactNode[] = []

  blocks.forEach((block, index) => {
    const lines = block.split('\n')
    if (lines.every((line) => /^\s*[-*]\s+/.test(line))) {
      nodes.push(
        <ul key={index}>
          {lines.map((line, lineIndex) => (
            <li key={lineIndex} dangerouslySetInnerHTML={{ __html: inline(line.replace(/^\s*[-*]\s+/, '')) }} />
          ))}
        </ul>,
      )
      return
    }
    const heading = /^(#{1,3})\s+(.+)$/.exec(lines[0] ?? '')
    if (heading && lines.length === 1) {
      const Tag = heading[1].length === 1 ? 'h3' : 'h4'
      nodes.push(<Tag key={index} dangerouslySetInnerHTML={{ __html: inline(heading[2]) }} />)
      return
    }
    nodes.push(<p key={index} dangerouslySetInnerHTML={{ __html: inline(block) }} />)
  })

  return <div className="mentor-markdown">{nodes}</div>
}
