import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { login, walletLogin } from "../../Api/api";

import { useAtom } from "jotai";
import { ethers } from "ethers";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css";
import { useToast } from "@chakra-ui/react";
import { user } from "../../atoms/status";
import { Tag } from "antd";
import useWalletAuth from "../../hooks/useWalletAuth";
const Login = () => {
  const [email, setEmail] = useState("");
  const from = location.state?.from?.pathname || "/profile";

  const navigate = useNavigate();
  // const { setAuth, setUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const toast = useToast({ position: "top" });
  const [userData, setUserData] = useAtom(user);

  const {
    provider,
    setProvider,
    setAccount,
    account,
    socialLoginSDK,
    setSocialLoginSDK,
  } = useWalletAuth();

  const queryClient = useQueryClient();
  const loc = useLocation();

  const { isLoading, mutate: walletMutate } = useMutation(walletLogin, {
    onSuccess: (data) => {
      const token = data?.accessToken;

      if (!data?.accessToken) {
        return toast({
          title: "Login failed",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      }

      toast({
        title: "Logined Successfuly",

        status: "success",
        duration: 2000,
        isClosable: true,
      });

      localStorage.setItem("jwt", token);

      setUserData({
        email: data.email,
        name: data.name,
      });

      setSuccess(true);

      navigate(from, { replace: true });
    },
    onError: (e) => {
      toast({
        title: e.statusText,

        status: "error",
        duration: 2000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      email,
      password,
    };
    mutate(payload);
  };

  const connectWeb3 = useCallback(async () => {
    if (typeof window === "undefined") return;

    if (socialLoginSDK?.provider) {
      const web3Provider = new ethers.providers.Web3Provider(
        socialLoginSDK.provider
      );

      setProvider(web3Provider);

      const accounts = await web3Provider.listAccounts();

      setAccount(accounts[0]);

      return;
    }
    if (socialLoginSDK) {
      socialLoginSDK.showWallet();
      // This is another example
      return socialLoginSDK;
    }
    const sdk = new SocialLogin();
    await sdk.init({
      chainId: ethers.utils.hexValue(80001),
    });
    setSocialLoginSDK(sdk);
    sdk.showWallet();
    return socialLoginSDK;
  }, [socialLoginSDK]);

  // Close wallet if already login
  useEffect(() => {
    console.log("hidelwallet");
    if (socialLoginSDK && socialLoginSDK.provider) {
      socialLoginSDK.hideWallet();
    }
  }, [account, socialLoginSDK]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (account) {
        clearInterval(interval);
      }
      if (socialLoginSDK?.provider && !account) {
        connectWeb3();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [account, connectWeb3, socialLoginSDK]);

  useEffect(() => {
    if (socialLoginSDK?.provider) return;
    connectWeb3();
  }, []);

  // desconnect web3
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

  useEffect(() => {
    console.log("hidelwallet");
    if (socialLoginSDK && socialLoginSDK.provider) {
      socialLoginSDK.hideWallet();
    }
  }, [account, socialLoginSDK]);

  useEffect(() => {
    const interval = setInterval(async () => {
      if (account) {
        clearInterval(interval);
      }
      if (socialLoginSDK?.provider && !account) {
        connectWeb3();
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [account, connectWeb3, socialLoginSDK]);

  const handleWallet = async () => {
    const provider = new ethers.providers.Web3Provider(socialLoginSDK.provider);

    const message = "Sign this message to log in to our app";

    const currentAccount = await provider.getSigner().getAddress();

    const signature = await provider.getSigner().signMessage(message);

    const payload = {
      address: currentAccount.toLocaleLowerCase(),
      signature: signature,
      message,
    };
    walletMutate(payload);
  };

  return (
    <Flex h="100vh" w={"100vw"} bg={"#2b2b2b"} justifyContent="center">
      <Flex
        marginX="6"
        marginY={"6"}
        w={[300, 300, 400]}
        flexDirection={"column"}
        mt={"36"}
      >
        <div
          className={`flex h-6 mb-10   ${
            socialLoginSDK?.provider ? "bg-green-400" : "bg-red-400"
          } w-24 text-center text-yellow-50 pl-2 rounded`}
        >
          {socialLoginSDK?.provider ? "Connected" : "Not connected"}
        </div>
        <div
          onClick={() => navigate("/")}
          className="text-md  bg-gray-500 rounded-full mb-10 flex items-center cursor-pointer  justify-center font-bold text-center uppercase"
        >
          <h1>
            Web3 <span className="block text-2xl">Notes</span>
          </h1>
          <Tag
            size={"sm"}
            className="ml-1 mb-6"
            variant="solid"
            colorScheme="teal"
          >
            beta
          </Tag>
        </div>
        <Button
          isLoading={isLoading}
          loadingText="Connecting"
          width={"full"}
          h="12"
          colorScheme={"teal"}
          mt={"4"}
          onClick={handleWallet}
        >
          Sign in
        </Button>

        <div></div>
        <Flex mt={"4"} justifyContent="center">
          <span
            style={{ textAlign: "center", marginRight: "6px", color: "wheat" }}
          >
            Don't have an account ?{" "}
          </span>
          <Link className="text-blue-400" to={"/sign_up"}>
            Sign up
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Login;
