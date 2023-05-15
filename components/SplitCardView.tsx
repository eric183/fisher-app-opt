import { Box } from "native-base";
import { Children, FC } from "react";

interface ISplitCardViewBottom {
  classname?: string;
  cc?: string;
  name?: string;
  children: React.ReactNode;
}

const SplitCardViewBottom: FC<ISplitCardViewBottom> = (props) => {
  const defaultClass = `${props.classname} rounded-t-3xl overflow-hidden`;
  return (
    <Box h={"70%"} className={defaultClass}>
      {Children.map(props.children, (child) => child)}
    </Box>
  );
};

export { SplitCardViewBottom };
