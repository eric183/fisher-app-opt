import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { NativeBaseProvider, Progress, AlertDialog, Button } from "native-base";
import { useState, useRef, useEffect } from "react";
import { useColorScheme } from "react-native";
import useDemandState from "../store/demand";
import useMatch, { IMatchResponse } from "../store/match";

const RootLayoutNav = () => {
  const colorScheme = useColorScheme();
  const { demandStatus } = useDemandState();
  const { matchInfo, setMatchInfo } = useMatch();
  const [showProgress, setShowProgress] = useState<boolean>(false);
  const cancelRef = useRef(null);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);

  const theme = colorScheme === "dark" ? DarkTheme : DefaultTheme;

  console.log(demandStatus, "...");

  useEffect(() => {
    if (demandStatus === "Pending") {
      setShowProgress(true);
    }

    if (demandStatus === "Matched" || demandStatus === "Error") {
      setTimeout(() => {
        setShowProgress(false);
      }, 1500);
    }
  }, [demandStatus]);

  const onClose = () => {
    setMatchInfo(undefined);
    setAlertOpen(false);
  };

  const progressMove = () => {
    switch (demandStatus) {
      case "Pending": {
        return 25;
      }
      case "Registed": {
        return 100;
      }
      case "Matching": {
        return 75;
      }
      case "Matched": {
        return 100;
      }
      default: {
        return 0;
      }
    }
  };

  useEffect(() => {
    if (typeof matchInfo === "boolean") {
      setAlertOpen(true);
    }

    if (typeof matchInfo === "object") {
      setAlertOpen(true);
    }
  }, [matchInfo]);

  return (
    <>
      <NativeBaseProvider>
        <ThemeProvider value={DefaultTheme}>
          {showProgress && <Progress value={progressMove()} />}

          {/* <AlertDialog
            leastDestructiveRef={cancelRef}
            isOpen={alertOpen}
            onClose={onClose}
          >
            <AlertDialog.Content>
              <AlertDialog.CloseButton />
              <AlertDialog.Header>匹配结果</AlertDialog.Header>
              <AlertDialog.Body textAlign="center">
                {matchInfo
                  ? JSON.stringify(matchInfo)
                  : "抱歉没有匹配结果，请返回修改或者下次再来"}
              </AlertDialog.Body>
              <AlertDialog.Footer justifyContent="center">
                <Button
                  variant="unstyled"
                  colorScheme="coolGray"
                  onPress={onClose}
                  ref={cancelRef}
                >
                  Got it!
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Content>
          </AlertDialog> */}

          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </ThemeProvider>
      </NativeBaseProvider>
    </>
  );
};

export default RootLayoutNav;
