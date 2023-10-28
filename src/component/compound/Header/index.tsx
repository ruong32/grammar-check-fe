import { Container } from "@/component/atom"
import { cx } from "@/helper"
import Link from "next/link"
import { useI18nServer } from "@/hook/useI18nServer"
import dynamic from "next/dynamic"

const MenuButton = dynamic(() => import('./MenuButton'), {
    ssr: false
})

const LanguageChanger = dynamic(() => import('../LanguageChanger'), {
    ssr: false
})

const ThemeChanger = dynamic(() => import('../ThemeChanger'), {
    ssr: false
})

const Header = () => {
    const [t] = useI18nServer('header')
    const LinkItem = ({href = '', name = ''}) => {
        return (
            <Link
                className="cursor-pointer text-sm"
                href={href}
            >
                {name}
            </Link>
        )
    }
    return (
        <div
            className={cx(
                'fixed top-0 w-full mx-auto bg-slate-100 z-50',
                'dark:bg-gray-900'
            )}
        >
            <Container
                className={cx(
                    'py-4 flex items-center justify-between'
                )}
            >
                {/* <div className="h-[2.625rem] w-[2.625rem] bg-cover bg-[url(/asset/image/logo-dark-60x60.png)] dark:bg-[url(/asset/image/logo-dark-60x60.png)]"></div> */}
                <div className="text-lg font-bold">Grammar Check <span className="text-xs font-normal">beta</span></div>
                <div className="flex items-center">
                    <div className="hidden text-lg gap-10 lg:flex">
                        <LinkItem href='/' name={t('paraphrase')}/>
                        {/* <LinkItem href='/analyzer' name={t('analyzer')}/> */}
                    </div>
                    <LanguageChanger className="mr-4 lg:ml-12"/>
                    <ThemeChanger className="mr-4 lg:mr-0"/>
                    <MenuButton/>
                </div>
            </Container>
        </div>
    )
}

export default Header
