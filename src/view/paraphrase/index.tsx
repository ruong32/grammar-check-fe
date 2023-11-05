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
import { Check, ChevronDown, Document, Spinner } from "@/component/icon";
import { cx } from "@/helper";
import { useI18nClient } from "@/hook/useI18nClient";
import Sentence from "./Sentence";
import { HistoryItem, SynonymData } from "@/types";
import Synonym from "./Synonym";
import AccentSelect from "./AccentSelect";
import History from "./History";
import * as Select from "@radix-ui/react-select";

const HomeView = () => {
  const [t] = useI18nClient("paraphrase");
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [synonym, setSynonym] = useState<number>(30);
  const [currentMode, setCurrentMode] =
    useState<(typeof SUGGESTED_MODES)[number]>("standard");
  const [customMode, setCustomMode] = useState<string>("");
  const synonyms = useRef<SynonymData[]>([]);
  const [disableCustomMode, setDisableCustomMode] = useState<boolean>(false);
  const changedWords = useRef<string[]>([]);
  const paraphraseLanguage = useRef<string>("US");

  const canUseCustomMode = () => !disableCustomMode && customMode.length > 0;

  const renderModeSuggestion = () => {
    const selectedModeStyle = "font-semibold border-b-2 border-green-500";
    return (
      <>
        <div className="hidden flex-wrap [&>span]:mx-2 [&>span]:mb-2 sm:flex">
          {SUGGESTED_MODES.map((mode) => (
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
          ))}
        </div>
        <div className="flex items-center text-sm sm:hidden">
          <div className="mr-2">Mode:</div>
          <Select.Root>
            <Select.Trigger asChild>
              <div
                className={cx(
                  "flex items-center px-1 py-2 rounded-md cursor-pointer hover:bg-green-500/20"
                )}
              >
                {t(currentMode)}
                <ChevronDown className="ml-2" height={20} width={20} />
              </div>
            </Select.Trigger>
            <Select.Portal>
              <Select.Content
                className="py-1 space-y-1 w-full rounded-md text-sm bg-gray-50 shadow-md z-10 dark:bg-gray-700"
                position="popper"
              >
                {SUGGESTED_MODES.map((mode) => (
                  <div
                    key={mode}
                    onClick={() => {
                      setDisableCustomMode(true);
                      setCustomMode(`Paraphrase my text in ${mode} style`);
                      setCurrentMode(mode);
                    }}
                    className="px-2 py-1 flex items-center cursor-pointer outline-none hover:bg-gray-200/50 hover:dark:bg-gray-600"
                  >
                    <div>{t(mode)}</div>
                    {mode === currentMode && (
                      <Check
                        height={20}
                        width={20}
                        className="ml-2 text-green-500"
                      />
                    )}
                  </div>
                ))}
              </Select.Content>
            </Select.Portal>
          </Select.Root>
        </div>
      </>
    );
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
          lang: paraphraseLanguage.current,
        })
      : paraphrase({
          data: input,
          mode: currentMode,
          synonym: synonym,
          lang: paraphraseLanguage.current,
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
      const words = sentence.match(/\s+|[^\s]+/g);
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
                        ? "text-yellow-600 dark:text-yellow-500"
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
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  }, []);

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
    const input = document.getElementById("paraphrase-input-field");
    if (input) {
      input.textContent =
        "A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs.";
      setInput(
        "A paragraph is a series of sentences that are organized and coherent, and are all related to a single topic. Almost every piece of writing you do that is longer than a few sentences should be organized into paragraphs."
      );
    }
  };

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
      {isLoading && (
        <div className="fixed top-0 left-0 h-full w-full flex items-center justify-center rounded-md z-50 bg-gray-100 dark:bg-gray-700">
          <Spinner height="42" width="42" className="text-green-500" />
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
        <div className="mt-3 flex justify-between items-center flex-wrap">
          {renderModeSuggestion()}
          <div className="flex items-center text-sm">
            <p className="mr-2">{t("synonym")}</p>
            <Slider
              value={[synonym]}
              className="w-[5rem] sm:w-[8rem]"
              onValueChange={(value) => {
                const newSynonym = value[0] < 30 ? 30 : value[0];
                setSynonym(newSynonym);
              }}
            />
          </div>
        </div>
        <div className="mt-4 flex justify-between">
          <AccentSelect
            className="md:mr-4"
            onChange={(lang) => {
              paraphraseLanguage.current = lang.value;
            }}
          />
          <History onHistoryClick={onHistoryClick} />
        </div>
        <Resizable
          className="my-2 min-h-[50vh]"
          left={
            <TextArea
              id="paraphrase-input-field"
              className="pb-11"
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
              className="pb-11"
            />
          }
        />
      </div>
    </Container>
  );
};

export default HomeView;
