"use client";

import { useState, useEffect, useRef } from "react";
import { Root, createRoot } from "react-dom/client";
import { paraphrase, customParaphrase, getSynonym } from "@/api";
import { MAX_HISTORY_ITEM, STORAGE_KEY, SUGGESTED_MODES } from "@/common";
import {
  Button,
  Container,
  Input,
  Resizable,
  Slider,
  TextArea,
} from "@/component/atom";
import { Document, Spinner } from "@/component/icon";
import { cx } from "@/helper";
import { useI18nClient } from "@/hook/useI18nClient";
import Sentence from "./Sentence";
import { HistoryItem, SynonymData } from "@/types";
import Synonym from "./Synonym";
import AccentSelect from "./AccentSelect";
import History from "./History";

const HomeView = () => {
  const [t] = useI18nClient("paraphrase");
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [synonym, setSynonym] = useState<number>(30);
  const [currentMode, setCurrentMode] =
    useState<(typeof SUGGESTED_MODES)[number]>("standard");
  const [customMode, setCustomMode] = useState<string>("");
  const synonyms = useRef<SynonymData[]>([]);
  const [disableCustomMode, setDisableCustomMode] = useState<boolean>(false);
  const changedWords = useRef<string[]>([]);

  const canUseCustomMode = () => !disableCustomMode && customMode.length > 0;

  const renderModeSuggestion = () => {
    const selectedModeStyle = "font-semibold border-b-2 border-green-500";
    return SUGGESTED_MODES.map((mode) => (
      <span
        key={mode}
        onClick={() => {
          setDisableCustomMode(true);
          setCustomMode(`Paraphrase my text in ${mode} style`);
          setCurrentMode(mode);
        }}
        className={cx(
          !canUseCustomMode() && mode === currentMode
            ? selectedModeStyle
            : null,
          "cursor-pointer"
        )}
      >
        {t(mode)}
      </span>
    ));
  };

  const saveHistory = (item: HistoryItem) => {
    const historyItems: HistoryItem[] = JSON.parse(
      localStorage.getItem(STORAGE_KEY.HISTORY) || "[]"
    );
    historyItems.unshift(item);
    historyItems.splice(MAX_HISTORY_ITEM);
    localStorage.setItem(STORAGE_KEY.HISTORY, JSON.stringify(historyItems));
  };

  const onHistoryClick = (item: HistoryItem) => {
    setInput(item.input);
    changedWords.current = item.detail.map(([start, end]) =>
      item.result.substring(start, end)
    );
    synonyms.current = item.synonyms;
    setResult(item.result);
  };

  const submit = async () => {
    setIsProcessing(true);
    const [paraphraseResult] = await (canUseCustomMode()
      ? customParaphrase({
          data: input,
          type_content: customMode,
          synonym: synonym,
        })
      : paraphrase({
          data: input,
          mode: currentMode,
          synonym: synonym,
        }));
    if (paraphraseResult?.result) {
      changedWords.current = paraphraseResult.detail.map(([start, end]) =>
        paraphraseResult.result.substring(start, end)
      );
      const [synonymResult] = await getSynonym({
        data: paraphraseResult.result,
      });
      if (synonymResult?.synonym) {
        synonyms.current = synonymResult.synonym;
      } else {
        synonyms.current = [];
      }
      saveHistory({
        input,
        result: paraphraseResult.result,
        detail: paraphraseResult.detail,
        synonyms: synonyms.current,
        createdAt: new Date().getTime(),
      });
      setResult(paraphraseResult.result);
    }
    setIsProcessing(false);
  };

  const renderSentences = (
    root: Root | undefined,
    paragraph: string,
    type: "input" | "result"
  ) => {
    if (!root) {
      return;
    }
    const sentences = paragraph.match(/[^\.!\?]+[\.!\?]+|[^\.!\?]+/g);
    const sentenceElements = sentences?.map((sentence, index) => {
      return (
        <Sentence key={index} type={type} order={index}>
          {sentence}
        </Sentence>
      );
    });
    root.render(sentenceElements);
  };

  const renderSentencesWithSynonyms = (
    root: Root | undefined,
    paragraph: string,
    changedWords: string[],
    synonyms: SynonymData[],
    type: "input" | "result"
  ) => {
    if (!root) {
      return;
    }
    const sentences = paragraph.match(/[^\.!\?]+[\.!\?]+|[^\.!\?]+/g);
    const sentenceElements = sentences?.map((sentence, index) => {
      const words = sentence.match(/\w+|\s+|[^\s\w]+/g);
      return (
        <Sentence key={index} type={type} order={index}>
          {words
            ? words.map((word, wordIndex) => {
                const synonymIndex = synonyms.findIndex(
                  (item) => Object.keys(item)[0] === word
                );
                const changedWordIndex = changedWords.indexOf(word);
                if (changedWordIndex > -1) {
                  changedWords.splice(changedWordIndex, 1);
                }
                if (synonymIndex > -1) {
                  const synonym = synonyms.splice(synonymIndex, 1)[0];
                  return (
                    <Synonym
                      key={`${word}-${index}-${wordIndex}`}
                      isChangedWord={changedWordIndex > -1}
                      synonym={synonym}
                    />
                  );
                }
                return (
                  <span
                    key={`${word}-${index}-${wordIndex}`}
                    className={cx(
                      changedWordIndex > -1
                        ? "text-yellow-600 dark:bg-yellow-500"
                        : ""
                    )}
                  >
                    {word}
                  </span>
                );
              })
            : sentence}
        </Sentence>
      );
    });
    root.render(sentenceElements);
  };

  useEffect(() => {
    const initRoot = (id: string) => {
      const rootElement = document.getElementById(id);
      if (!rootElement) {
        return;
      }
      return createRoot(rootElement);
    };
    const inputRoot = initRoot("paraphrase-input-field");
    const resultRoot = initRoot("paraphrase-result-field");
    renderSentences(inputRoot, input, "input");
    renderSentencesWithSynonyms(
      resultRoot,
      result,
      changedWords.current,
      synonyms.current,
      "result"
    );
    return () => {
      inputRoot?.unmount();
      resultRoot?.unmount();
    };
  }, [result]);

	const onTryExample = () => {
		const input = document.getElementById("paraphrase-input-field")
		if (input) {
			input.textContent = "A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs."
			setInput("A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.")
		}
	}

  return (
    <Container className="relative">
      {isProcessing && (
        <div className="absolute top-0 left-0 h-full w-full flex items-center justify-center text-gray-700 z-10 dark:text-gray-50">
          <div className="flex items-center bg-[#ffffff] px-4 py-2 rounded-lg dark:bg-gray-600">
            <Spinner className="text-green-500 mr-2" /> Processing, please
            wait...
          </div>
        </div>
      )}
      <div
        className={cx(isProcessing ? "opacity-30 pointer-events-none" : null)}
      >
        <div className="mt-8 flex w-full">
          <Input
            containerClassName="flex-1 rounded-r-none"
            placeholder={t("customModePlaceholder")}
            value={customMode}
            onChange={(e) => {
              setCustomMode(e.currentTarget.value);
            }}
            onClick={() => setDisableCustomMode(false)}
            disable={disableCustomMode}
          />
          <Button
            className="rounded-l-none text-white"
            color="green"
            onClick={submit}
          >
            {t("paraphrase")}
          </Button>
        </div>
        <div className="mt-3 flex justify-between items-start flex-wrap">
          <div className="flex flex-wrap [&>span]:mx-2 [&>span]:mb-2">
            {renderModeSuggestion()}
          </div>
          <div className="flex items-center gap-3">
            <p>{t("synonym")}</p>
            <Slider
              value={[synonym]}
              onValueChange={(value) => {
                const newSynonym = value[0] < 30 ? 30 : value[0];
                setSynonym(newSynonym);
              }}
            />
          </div>
        </div>
        <div className="mt-4 flex flex-col items-start md:flex-row md:justify-between">
          <AccentSelect className="md:mr-4" />
          <History onHistoryClick={onHistoryClick} />
        </div>
        <Resizable
          className="my-2 min-h-[50vh]"
          left={
            <TextArea
              id="paraphrase-input-field"
              className="min-h-[50vh] p-2 rounded-lg text-sm"
              placeholder={t("inputPlaceholder")}
              onInput={(e) => {
                setInput(e.currentTarget.innerText);
              }}
              extraElement={
                input.length === 0 ? (
                  <div
                    className={cx(
                      "absolute py-1 px-2 w-fit top-1/3 inset-x-0 mx-auto cursor-pointer",
                      "bg-slate-300 rounded-lg text-sm flex items-center",
                      "hover:bg-green-500 hover:text-gray-50",
                      "dark:bg-slate-700 dark:hover:bg-green-500"
                    )}
										onClick={onTryExample}
                  >
                    <Document className="mr-1" />
                    {t("tryExample")}
                  </div>
                ) : null
              }
            />
          }
          right={
            <TextArea
              id="paraphrase-result-field"
              placeholder={t("resultPlaceholder")}
              className="min-h-[50vh] p-2 rounded-lg text-sm"
            />
          }
        />
      </div>
    </Container>
  );
};

export default HomeView;
