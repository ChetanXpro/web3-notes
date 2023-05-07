import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { FormControl, FormErrorMessage } from "@chakra-ui/react";
import { login, signup } from "../../Api/api";
import SocialLogin from "@biconomy/web3-auth";
import "@biconomy/web3-auth/dist/src/style.css";
import { ethers } from "ethers";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";
import { useToast } from "@chakra-ui/react";
import { useEffect } from "react";
import { Tag } from "antd";
import useWalletAuth from "../../hooks/useWalletAuth";

const Signup = () => {
  const {
    provider,
    setProvider,
    setAccount,
    account,
    socialLoginSDK,
    setSocialLoginSDK,
  } = useWalletAuth();
  const [name, setName] = useState("");

  const [success, setSuccess] = useState(false);
  const from = location?.state?.from?.pathname || "/";
  const navigate = useNavigate();
  const toast = useToast({ position: "top" });

  const { isLoading, isError, error, mutate } = useMutation(signup, {
    onSuccess: (data) => {
      toast({
        title: "Account created",

        status: "success",
        duration: 2000,
        isClosable: true,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate("/sign_in");
      }, 400);
    },
    onError: () => {
      console.log("error");
    },
  });

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
    console.log(socialLoginSDK);
    if (socialLoginSDK?.provider) return;
    connectWeb3();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // address , signature , message, name
    const message = "Sign this message to log in to our app";
    const provider = new ethers.providers.Web3Provider(socialLoginSDK.provider);

    const currentAccount = await provider.getSigner().getAddress();

    const signature = await provider.getSigner().signMessage(message);

    const payload = {
      address: currentAccount.toLocaleLowerCase(),
      name: name,
      message,
      signature,
    };

    mutate(payload);
  };
  return (
    <Flex h="100vh" bg={"#2b2b2b"} justifyContent="center">
      <Flex
        marginX="6"
        marginY={"6"}
        w={[300, 300, 400]}
        flexDirection={"column"}
        mt={"36"}
      >
        <form onSubmit={handleSubmit}>
          <div
            className={`flex h-6 mb-10   ${
              socialLoginSDK?.provider ? "bg-green-400" : "bg-red-400"
            } w-24 text-center pl-2 rounded`}
          >
            {" "}
            {socialLoginSDK?.provider ? "Connected" : "Not connected"}
          </div>
          <div
            onClick={() => navigate("/")}
            className="text-md mb-10 bg-gray-500 rounded-full flex items-center cursor-pointer  justify-center font-bold text-center uppercase"
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

          <Text
            textAlign={"center"}
            color="white"
            fontFamily={"heading"}
            fontSize="2xl"
            mb={"6"}
          >
            Create your account
          </Text>

          <Input
            type={"name"}
            h="10"
            color={"whiteAlpha.900"}
            autoComplete="true"
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
          />

          <Button
            isLoading={isLoading}
            loadingText="Creating account"
            width={"full"}
            h="12"
            colorScheme={`${success ? "green" : "teal"}`}
            mt={"4"}
            onClick={handleSubmit}
          >
            {success ? "Account Created" : "Sign up"}
          </Button>
        </form>
        <Flex mt={"4"} justifyContent="center">
          <span
            style={{ textAlign: "center", marginRight: "6px", color: "wheat" }}
          >
            Already have an account ?{" "}
          </span>
          <Link className="text-blue-400" to={"/sign_in"}>
            Sign in
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default Signup;
