"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CryptoJS = require("crypto-js");
const react_1 = require("react");
function useKillua(args) {
    //* current thunder key name in localstorage
    const thunderKeyName = `thunder${args.key
        .charAt(0)
        .toUpperCase()}${args.key.slice(1)}`;
    //* generate uniqe browser id for salt key
    function getUniqeBrowserId() {
        const browserInfo = window.navigator.userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        const browserName = browserInfo[1].toLowerCase();
        const browserVersion = browserInfo[2];
        return `${browserName}${browserVersion}${window.navigator.userAgent}`;
    }
    //* set to localstorage
    function setToLocalstorage(args) {
        localStorage.setItem(args.key, args.encrypt
            ? CryptoJS.AES.encrypt(JSON.stringify(args.data), getUniqeBrowserId()).toString()
            : JSON.stringify(args.data));
    }
    //* get thunder from localstorage
    function getThunderFromLocalstorage() {
        let parsedValue = args.default;
        const localStorageValue = localStorage.getItem(thunderKeyName);
        if (localStorageValue) {
            try {
                parsedValue = JSON.parse(args.encrypt
                    ? CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(CryptoJS.enc.Utf8)
                    : localStorageValue);
            }
            catch (_a) {
                setThunderToLocalstorageAndStateHandler({
                    key: thunderKeyName,
                    data: args.default,
                    encrypt: args.encrypt,
                });
            }
        }
        else {
            setThunderToLocalstorageAndStateHandler({
                key: thunderKeyName,
                data: args.default,
                encrypt: args.encrypt,
            });
        }
        return parsedValue;
    }
    //* detect change thunder config by developer and create again thunder key in localstorage
    (0, react_1.useEffect)(() => {
        function detectChangeThunderConfigByDeveloper() {
            // get key 'thundersChecksum' from localStorage
            function getThundersChecksumFromLocalstorage() {
                let parsedValue = {};
                const localStorageValue = localStorage.getItem("thundersChecksum");
                if (localStorageValue) {
                    try {
                        parsedValue = JSON.parse(CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(CryptoJS.enc.Utf8));
                    }
                    catch (_a) {
                        setToLocalstorage({
                            key: "thundersChecksum",
                            data: {},
                            encrypt: true,
                        });
                    }
                }
                else {
                    setToLocalstorage({
                        key: "thundersChecksum",
                        data: {},
                        encrypt: true,
                    });
                }
                return parsedValue;
            }
            const thundersChecksumLocalstorage = getThundersChecksumFromLocalstorage();
            // update thunder checksum in localStorage && reset thunder-key&thunder-state to default value handler
            const updateThunderChecksumHandler = () => {
                Object(thundersChecksumLocalstorage)[thunderKeyName] = CryptoJS.MD5(JSON.stringify(args)).toString();
                setToLocalstorage({
                    key: "thundersChecksum",
                    data: thundersChecksumLocalstorage,
                    encrypt: true,
                });
                setThunderToLocalstorageAndStateHandler({
                    key: thunderKeyName,
                    data: args.default,
                    encrypt: args.encrypt,
                });
            };
            // if 'thundersChecksum' is not in localStorage ? (add key to 'thundersChecksum' with checksum && reset thunder-key&thunder-state to default value) : (if changed thunder config by developer && (update checksum && reset thunder-key&thunder-state to default value))
            if (!thundersChecksumLocalstorage.hasOwnProperty(thunderKeyName)) {
                updateThunderChecksumHandler();
            }
            else {
                if (Object(thundersChecksumLocalstorage)[thunderKeyName] !==
                    CryptoJS.MD5(JSON.stringify(args)).toString()) {
                    console.log('args', CryptoJS.MD5(JSON.stringify(args)).toString());
                    console.log('thundersChecksumLocalstorage', Object(thundersChecksumLocalstorage)[thunderKeyName]);
                    updateThunderChecksumHandler();
                }
            }
        }
        detectChangeThunderConfigByDeveloper();
        window.addEventListener("storage", detectChangeThunderConfigByDeveloper);
        return () => {
            window.removeEventListener("storage", detectChangeThunderConfigByDeveloper);
        };
    }, []);
    //* thunder state with initial-value from localstorage
    const [thunderState, setThunderState] = (0, react_1.useState)(() => typeof window === "undefined" ? undefined : getThunderFromLocalstorage());
    const isMountedRef = (0, react_1.useRef)(false);
    (0, react_1.useEffect)(() => {
        if (!isMountedRef.current) {
            if (thunderState === undefined) {
                setThunderState(getThunderFromLocalstorage());
            }
            isMountedRef.current = true;
        }
    }, []);
    //* set thunder to localstorage and state handler
    function setThunderToLocalstorageAndStateHandler(args) {
        setToLocalstorage({
            key: thunderKeyName,
            data: args.data,
            encrypt: args.encrypt,
        });
        setThunderState(args.data);
    }
    //* update thunder state in other browser tab with updated localstorage value
    (0, react_1.useEffect)(() => {
        const getUpdatedThunderFromLocalstorage = () => {
            const localstorageValue = getThunderFromLocalstorage();
            if (localstorageValue !== thunderState) {
                setThunderState(localstorageValue);
            }
        };
        window.addEventListener("storage", getUpdatedThunderFromLocalstorage);
        return () => {
            window.removeEventListener("storage", getUpdatedThunderFromLocalstorage);
        };
    }, []);
    /*
      //* set expire time and remove expired thunder from localstorage
      // get 'thundersExpire' from localStorage
      const getThundersExpireFromLocalstorage = (): Object => {
        let parsedValue = {};
        const localStorageValue = localStorage.getItem("thundersExpire");
        const removeAllThundersFromLocalstorage = () => {
          const keysToRemove = [];
          for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key && key.startsWith("thunder") && key !== "thundersExpire") {
              keysToRemove.push(key);
            }
          }
          keysToRemove.forEach((key) => {
            localStorage.removeItem(key);
          });
        };
        if (localStorageValue) {
          try {
            parsedValue = JSON.parse(
              CryptoJS.AES.decrypt(localStorageValue, getUniqeBrowserId()).toString(
                CryptoJS.enc.Utf8
              )
            );
          } catch {
            // delete all localStorage keys starting with 'thunder'
            removeAllThundersFromLocalstorage();
            // create 'thundersExpire' with an empty object encrypted
            setToLocalstorage({
              key: "thundersExpire",
              data: {},
              encrypt: true,
            });
          }
        } else {
          // delete all localStorage keys starting with 'thunder'
          removeAllThundersFromLocalstorage();
          // create 'thundersExpire' with an empty object encrypted
          setToLocalstorage({
            key: "thundersExpire",
            data: {},
            encrypt: true,
          });
        }
        return parsedValue;
      };
      // set expire time and remove expired thunder from localstorage
      const thundersExpireLocalstorage = getThundersExpireFromLocalstorage();
      useEffect(() => {
        function pushThunderToExpireThunderKeyInLocalstorage() {
          Object(thundersExpireLocalstorage)[thunderKeyName] =
            args.expire === null ? null : Date.now() + args.expire * 60 * 1000;
          setToLocalstorage({
            key: "thundersExpire",
            data: thundersExpireLocalstorage,
            encrypt: true,
          });
        }
        let intervalId: any;
        let logIntervalId: any;
        if (thundersExpireLocalstorage !== undefined) {
          // if 'args.key' is not in 'thundersExpire' object && push it to 'thundersExpire' with expire time
          if (Object(thundersExpireLocalstorage)[thunderKeyName] === undefined) {
            pushThunderToExpireThunderKeyInLocalstorage();
          }
          // if date.now > expire time ? remove thunder expired from localStorage and 'thundersExpire' object : setInterval for remove from localStorage and 'thundersExpire' object
          if (
            thundersExpireLocalstorage &&
            Object(thundersExpireLocalstorage)[thunderKeyName] !== null
          ) {
            // function for remove from localStorage and 'thundersExpire'
            function removeThundersExpiredThunder() {
              setThunderToLocalstorageAndStateHandler({
                key: thunderKeyName,
                data: args.default,
                encrypt: args.encrypt,
              });
              pushThunderToExpireThunderKeyInLocalstorage();
            }
            // if thunder expire ? remove it from localStorage and 'thundersExpire' object : setInterval for remove from localStorage and 'thundersExpire' object
            if (Date.now() > Object(thundersExpireLocalstorage)[thunderKeyName]) {
              removeThundersExpiredThunder();
            } else {
              logIntervalId = setInterval(() => {
                console.log(
                  thunderKeyName,
                  Object(thundersExpireLocalstorage)[thunderKeyName] - Date.now()
                );
              }, 1000);
              intervalId = setInterval(() => {
                removeThundersExpiredThunder();
              }, Object(thundersExpireLocalstorage)[thunderKeyName] - Date.now());
            }
          }
        }
        return (): void => {
          clearInterval(intervalId);
          clearInterval(logIntervalId);
        };
      }, [thunderState]);
    */
    //* return thunder state and setThunder state function and detect isReady thunder state and reducers object
    // assign thunder config reducers to reducers object
    const reducers = {};
    if (args.reducers) {
        for (const actionName in args.reducers) {
            if (Object.prototype.hasOwnProperty.call(args.reducers, actionName)) {
                const actionFunc = args.reducers[actionName];
                reducers[actionName] = (payload) => {
                    setThunderToLocalstorageAndStateHandler({
                        key: thunderKeyName,
                        data: actionFunc(thunderState, payload),
                        encrypt: args.encrypt,
                    });
                };
            }
        }
    }
    // handler for update thunder state
    function setThunderHandler(value) {
        if (typeof value === "function") {
            setThunderToLocalstorageAndStateHandler({
                key: thunderKeyName,
                data: value(thunderState),
                encrypt: args.encrypt,
            });
        }
        else {
            setThunderToLocalstorageAndStateHandler({
                key: thunderKeyName,
                data: value,
                encrypt: args.encrypt,
            });
        }
    }
    return {
        thunder: thunderState,
        setThunder: setThunderHandler,
        isReady: thunderState === undefined ? false : true,
        reducers,
    };
}
exports.default = useKillua;
