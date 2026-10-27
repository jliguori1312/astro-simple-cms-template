// The CMS seam. simple-cms writes site.json and this module is the only thing that
   // imports it, so swapping to a build-time fetch never touches a component.
   //
   // Images live in src/assets/images so Astro can optimise them at build. site.json
   // refers to them by filename and they are resolved here, keeping asset paths out of
   // components. `null` is valid: the scaffold ships without media.
   import type { ImageMetadata } from 'astro'
   import content from '@/content/site.json'

   const images = import.meta.glob<ImageMetadata>('/src/assets/images/*.{png,webp,jpg,jpeg,avif}', {
     eager: true,
     import: 'default',
   })

   const image = (file: string | null): ImageMetadata | null => {
     if (file === null) return null
     const resolved = images[`/src/assets/images/${file}`]
     if (!resolved) throw new Error(`Unknown image in src/assets/images: ${file}`)
     return resolved
   }

   export interface ModalLink {
     label: string
     href: string
   }

   export interface Modal {
     title: string
     body: string
     links?: ModalLink[]
   }

   export interface CompanyLink {
     label: string
     modal: Modal
   }

   export interface CompanyGroup {
     label: string
     links: CompanyLink[]
   }

   export interface Section {
     heading: string
     body: string
   }

   /** A nav item either scrolls to `target` or opens `modal`, never both. */
   export interface NavItem {
     label: string
     target?: string
     modal?: Modal
   }

   export interface SiteContent {
     seo: { title: string; description: string }
     hero: { video: string | null; image: ImageMetadata | null }
     logo: { image: ImageMetadata | null; alt: string }
     header: {
       sisterCompanies: CompanyGroup
       affiliateCompanies: CompanyGroup
     }
     nav: NavItem[]
     sections: { overview: Section; gallery: Section }
   }

   /** Body copy is authored as plain text; a blank line starts a new paragraph. */
   export const paragraphs = (body: string) => body.split(/\n{2,}/).filter(Boolean)

   export const site: SiteContent = {
     seo: content.seo,
     hero: { video: content.hero.video, image: image(content.hero.image) },
     logo: { image: image(content.logo.image), alt: content.logo.alt },
     header: content.header,
     nav: content.nav,
     sections: content.sections,
   }
