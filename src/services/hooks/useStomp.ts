import { useContext } from "react";

import { StompContext } from "../StompSessionProvider";

export const useStomp = () => useContext(StompContext);
