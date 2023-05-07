import { Avatar, IconButton, Text, useColorMode } from "@chakra-ui/react";
import { Image, Avatar as Avatarr } from "antd";
import { useAtom } from "jotai";

import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

import Discord from "../../assets/discord.png";
import WhiteDiscord from "../../assets/whitedis.png";
import logo from "../../assets/nobg.png";
import { Icon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { AntDesignOutlined, CloseOutlined } from "@ant-design/icons";
import useWalletAuth from "../../hooks/useWalletAuth";

const AvtarDrop = ({ setAvtarDrop }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const navigate = useNavigate();

  const {
    setProvider,
    setAccount,

    socialLoginSDK,
  } = useWalletAuth();

  const disconnectWeb3 = async () => {
    if (!socialLoginSDK || !socialLoginSDK.web3auth) {
      console.error("Web3Modal not initialized.");
      return;
    }
    await socialLoginSDK.logout();
    socialLoginSDK.hideWallet();
    setProvider(undefined);
    setAccount(undefined);
  };

  const logout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("openlogin_store");
    localStorage.removeItem("Web3Auth-cachedAdapter");

    disconnectWeb3();
    navigate("sign_in");
  };

  return (
    <ul
      className={
        "flex-col flex absolute rounded-xl  z-50 items-center top-12 right-1 bottom-0 h-[6rem]   uppercase bg-black/40 backdrop-blur-lg gap-8 justify-center p-8 "
      }
    >
      <Text className="hover:underline cursor-pointer" onClick={logout}>
        Logout
      </Text>
    </ul>
  );
};

export default AvtarDrop;
