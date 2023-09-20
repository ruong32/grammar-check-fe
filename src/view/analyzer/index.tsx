import { Button, Container, Slider, TextEditor } from "@/component/atom"
import { useI18nServer } from "@/hook/useI18nServer"

const AnalyzerView = async () => {
    const [t] = useI18nServer('analyzer')
	return (
		<Container>
			<div className="mt-8 flex gap-6">
				<TextEditor 
                    className="flex-1"
                    placeholder={t('editorPlaceholder')}
                />
                <div className="p-4 shadow-[0_0_1px] shadow-gray-500 rounded-md">
                    <Button color="green">Analyzer</Button>
                    <div className="mt-3 p-2 shadow-[0_0_1px] shadow-gray-500 rounded-md">
                        <div>Tone</div>
                        <div>
                            <div className="mt-2 text-sm text-gray-700 flex items-center">
                                <span className="mr-2">Formal</span>
                                <Slider hideThumb disabled className="w-[6.25rem]" rangeClassName="bg-lime-500" defaultValue={[80]}/>
                            </div>
                            <div className="mt-2 text-sm text-gray-700 flex items-center">
                                <span className="mr-2">Formal</span>
                                <Slider hideThumb disabled className="w-[6.25rem]" rangeClassName="bg-lime-500" defaultValue={[85]}/>
                            </div>
                            <div className="mt-2 text-sm text-gray-700 flex items-center">
                                <span className="mr-2">Formal</span>
                                <Slider hideThumb disabled className="w-[6.25rem]" rangeClassName="bg-lime-500" defaultValue={[70]}/>
                            </div>
                        </div>
                    </div>
                    <div className="mt-3 p-2 shadow-[0_0_1px] shadow-gray-500 rounded-md">
                        <div>Correctness</div>
                        <Slider hideThumb disabled rangeClassName="bg-red-500" defaultValue={[80]}/>
                        <Button className="mt-3" color="green">{t('correct')}</Button>
                    </div>
                    <div className="mt-3 p-2 shadow-[0_0_1px] shadow-gray-500 rounded-md">
                        <div>Clarity</div>
                        <Slider hideThumb disabled rangeClassName="bg-blue-500" defaultValue={[70]}/>
                        <div>Voice</div>
                        <Slider hideThumb disabled rangeClassName="bg-yellow-500" defaultValue={[75]}/>
                        <Button className="mt-3" color="green">{t('change')}</Button>
                    </div>
                    <Button className="mt-3" color="green">{t('fixAll')}</Button>
                </div>
			</div>
		</Container>
	)
}

export default AnalyzerView
