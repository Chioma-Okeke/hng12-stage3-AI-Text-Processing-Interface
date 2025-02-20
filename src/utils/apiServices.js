export const detectLanguage = async (message) => {
    const languageDetectorCapabilities =
        await self.ai.languageDetector.capabilities();
    const canDetect = languageDetectorCapabilities.capabilities;
    let detector;
    if (canDetect === "no") {
        throw new Error(
            "To use this application you need to have the Chrome built-in AI configured on your device"
        );
    }
    if (canDetect === "readily") {
        // The language detector can immediately be used.
        detector = await self.ai.languageDetector.create();
    } else {
        // The language detector can be used after model download.
        detector = await self.ai.languageDetector.create();
        await detector.ready;
    }
    const results = await detector.detect(message);
    const result = results[0];
    const languageMap = {
        en: "English",
        fr: "French",
        pt: "Portuguese",
        es: "Spanish",
        tr: "Turkish",
        ru: "Russian",
    };

    return (
        languageMap[result.detectedLanguage] || "beyond our language database"
    );
};

export const textTranslation = async (
    userMessage,
    expectedResponseLanguage
) => {
    if ("ai" in self && "translator" in self.ai) {
        console.log("The Translator API is supported.");
    }
    const languageMap = {
        English: "en",
        French: "fr",
        Portuguese: "pt",
        Spanish: "es",
        Turkish: "tr",
        Russian: "ru",
    };
    const incomingLanguage = languageMap[userMessage.detectedLanguage];
    const translatorCapabilities = await self.ai.translator.capabilities();
    const request = translatorCapabilities.languagePairAvailable(
        incomingLanguage,
        expectedResponseLanguage
    );

    if (request === "no") {
        throw new Error(
            "To use this application you need to have the Chrome built-in AI configured on your device"
        );
    }
    const translator = await self.ai.translator.create({
        sourceLanguage: incomingLanguage,
        targetLanguage: expectedResponseLanguage,
    });

    const response = await translator.translate(userMessage.text);
    return response;
};

export const textSummarization = async (message) => {
    const options = {
        sharedContext: "This is a scientific article",
        type: "tl;dr",
        format: "plain-text",
        length: "short",
    };

    const available = (await self.ai.summarizer.capabilities()).available;
    let summarizer;
    if (available === "no") {
        throw new Error(
            "To use this application you need to have the Chrome built-in AI configured on your device"
        );
    }
    if (available === "readily") {
        summarizer = await self.ai.summarizer.create(options);
    } else {
        summarizer = await self.ai.summarizer.create(options);
        summarizer.addEventListener("downloadprogress", (e) => {
            console.log(e.loaded, e.total);
        });
        await summarizer.ready;
    }
    const summary = await summarizer.summarize(message);
    return summary;
};
