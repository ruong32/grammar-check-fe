import { Container } from "@/component/atom"
import { cx } from "@/helper"
import Link from "next/link"
import { useI18nServer } from "@/hook/useI18nServer"
import dynamic from "next/dynamic"

const SettingButton = dynamic(() => import('./SettingButton'), {
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
                'fixed top-0 w-full mx-auto bg-white z-50',
                'dark:bg-gray-900'
            )}
        >
            <Container
                className={cx(
                    'py-2.5 flex items-center justify-between'
                )}
            >
                <div className="text-lg font-bold">Grammar Check <span className="text-xs font-normal">beta</span></div>
                <div className="flex items-center">
                    <div className="hidden text-lg gap-10 mr-4 lg:flex">
                        <LinkItem href='/' name={t('paraphrase')}/>
                        {/* <LinkItem href='/analyzer' name={t('analyzer')}/> */}
                    </div>
                    <SettingButton/>
                </div>
            </Container>
        </div>
    )
}

export default Header
