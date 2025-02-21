// Cache for capabilities to avoid repeated API calls
let cachedCapabilities = {
    languageDetector: null,
    translator: null,
    summarizer: null,
};

const languageMap = {
    English: "en",
    French: "fr",
    Portuguese: "pt",
    Spanish: "es",
    Turkish: "tr",
    Russian: "ru",
    en: "English",
    fr: "French",
    pt: "Portuguese",
    es: "Spanish",
    tr: "Turkish",
    ru: "Russian",
};

// Check if all AI features are properly configured and available
export const checkAIConfiguration = async () => {
    try {
        // Check if the AI object exists in the global scope
        if (!("ai" in self)) {
            console.log("Chrome AI API not available");
            return false;
        }

        // Get capabilities for all services (using cache when possible)
        const ldCapabilities = await getLanguageDetectorCapabilities();
        const translatorAvailable = "translator" in self.ai;
        const summarizerCapabilities = await getSummarizerCapabilities();

        // Return true only if all services are available
        return (
            ldCapabilities.available === "readily" &&
            translatorAvailable &&
            summarizerCapabilities.available === "readily"
        );
    } catch (error) {
        console.error("Error checking AI configuration:", error);
        return false;
    }
};

// Cache and retrieve language detector capabilities
async function getLanguageDetectorCapabilities() {
    if (cachedCapabilities.languageDetector === null) {
        cachedCapabilities.languageDetector =
            await self.ai.languageDetector.capabilities();
    }
    return cachedCapabilities.languageDetector;
}

// Cache and retrieve summarizer capabilities
async function getSummarizerCapabilities() {
    if (cachedCapabilities.summarizer === null) {
        cachedCapabilities.summarizer = await self.ai.summarizer.capabilities();
    }
    return cachedCapabilities.summarizer;
}

export const detectLanguage = async (message) => {
    const capabilities = await getLanguageDetectorCapabilities();

    if (capabilities.capabilities === "no") {
        throw new Error(
            "Language detection is not available at the moment."
        );
    }

    let detector = null;
    try {
        detector = await self.ai.languageDetector.create();
        if (capabilities.capabilities === "after-download") {
            await detector.ready;
        }

        const results = await detector.detect(message);
        const result = results[0];

        return (
            languageMap[result.detectedLanguage] ||
            "beyond our current language database."
        );
    } catch (error) {
        console.error(error);
        throw new Error("Could not detect language at the moment.");
    } finally {
        // Clean up resources
        if (detector) {
            detector.destroy?.();
        }
    }
};

export const textTranslation = async (
    userMessage,
    expectedResponseLanguage
) => {
    if (!("ai" in self) || !("translator" in self.ai)) {
        throw new Error("Translator API not supported in this browser");
    }

    

    const incomingLanguage = languageMap[userMessage.detectedLanguage];
    if (!incomingLanguage) {
        throw new Error(
            `Unsupported source language: ${userMessage.detectedLanguage}`
        );
    }

    const translatorCapabilities = await self.ai.translator.capabilities();
    const pairAvailable = translatorCapabilities.languagePairAvailable(
        incomingLanguage,
        expectedResponseLanguage
    );

    if (pairAvailable === "no") {
        throw new Error(
            `Translation from ${userMessage.detectedLanguage} to ${languageMap[expectedResponseLanguage]} not available`
        );
    }

    let translator = null;
    try {
        translator = await self.ai.translator.create({
            sourceLanguage: incomingLanguage,
            targetLanguage: expectedResponseLanguage,
        });

        if (pairAvailable === "after-download") {
            await translator.ready;
        }

        return await translator.translate(userMessage.text);
    } catch (error) {
        console.error(error);
        throw new Error("Could not translate text. Kindly try again.");
    } finally {
        // Clean up resources
        if (translator) {
            translator.destroy?.();
        }
    }
};

export const textSummarization = async (message) => {
    const capabilities = await getSummarizerCapabilities();

    if (capabilities.available === "no") {
        throw new Error(
            "Summarizer not available at the moment."
        );
    }

    const options = {
        sharedContext: "This is a scientific article",
        type: "tl;dr",
        format: "plain-text",
        length: "short",
    };

    let summarizer = null;
    try {
        summarizer = await self.ai.summarizer.create(options);
        console.log(summarizer, "??");
        if (capabilities.available === "after-download") {
            console.log("i am inside here");
            summarizer.addEventListener("downloadprogress", (e) => {
                console.log(
                    `Downloading summarizer model: ${Math.round(
                        (e.loaded / e.total) * 100
                    )}%`
                );
            });
            await summarizer.ready;
        }
        console.log("...processing");
        return await summarizer.summarize(message);
    } catch (error) {
        console.error(error);
        throw new Error("Could not summarize text. Kindly try again.");
    } finally {
        // Clean up resources
        if (summarizer) {
            summarizer.destroy?.();
        }
    }
};
