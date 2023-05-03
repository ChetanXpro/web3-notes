import React, { useState } from "react";

const useWalletAuth = () => {
  const [socialLoginSDK, setSocialLoginSDK] = useState(null);
  const [provider, setProvider] = useState();
  const [account, setAccount] = useState();
  return {
    socialLoginSDK,
    setSocialLoginSDK,
    provider,
    setProvider,
    account,
    setAccount,
  };
};

export default useWalletAuth;
