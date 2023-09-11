"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSSRKillua = void 0;
const react_1 = require("react");
const react_2 = __importDefault(require("react"));
const SSRKilluaContext = (0, react_1.createContext)(false);
const SSRKilluaProvider = ({ children }) => {
    return (react_2.default.createElement(SSRKilluaContext.Provider, { value: true }, children));
};
exports.default = SSRKilluaProvider;
const useSSRKillua = () => (0, react_1.useContext)(SSRKilluaContext);
exports.useSSRKillua = useSSRKillua;
