import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import style from "./styles/footer.scss"
import { version } from "../../package.json"
import { i18n } from "../i18n"

interface Options {
  links: Record<string, string>
}

export default ((opts?: Options) => {
  const Footer: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
    const year = new Date().getFullYear()
    const links = opts?.links ?? []
    return (
      <footer class={`${displayClass ?? ""}`}>
        {/* <ul> */}
        <a target="_blank" href="mailto:hyhyuan22@gmail.com" style="text-decoration: none;">
          <img id="icon" src="/secret/assets/icons/email.png" />
        </a>
        <a target="_blank" href="https://www.linkedin.com/in/heatheryuan/" style="text-decoration: none;">
          <img id="icon" src="/secret/assets/icons/linkedin.png" />
        </a>
        <a target="_blank" href="https://www.instagram.com/heather.yuan/" style="text-decoration: none;">
            <img id="icon" src="/secret/assets/icons/instagram.webp" />
        </a>
        <a target="_blank" href="https://www.tiktok.com/@heatheryuann" style="text-decoration: none;">
          <img id="icon" src="/secret/assets/icons/tiktok.png" />
        </a>
        <a target="_blank" href="https://www.youtube.com/@heatheryuann" style="text-decoration: none;">
          <img id="icon" src="/secret/assets/icons/youtube.webp" />
        </a>
        <a target="_blank" href="https://calendly.com/hyhyuan22/30min" style="text-decoration: none;">
          <img id="icon" src="/secret/assets/icons/calendar.png" />
        </a><br/>
        © {year} Heather Yuan
      </footer>
    )
  }

  Footer.css = style
  return Footer
}) satisfies QuartzComponentConstructor
