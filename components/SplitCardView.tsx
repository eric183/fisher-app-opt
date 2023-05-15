import { Box } from "native-base";
import { Children, FC } from "react";

interface ISplitCardViewBottom {
  name?: string;
  children: React.ReactNode;
}

const SplitCardViewBottom: FC<ISplitCardViewBottom> = ({ children }) => {
  return <Box>{Children.map(children, (child) => child)}</Box>;
};

export { SplitCardViewBottom };
