import { Box, View } from "native-base";
import { Children, FC } from "react";

interface ISplitCardViewBottom {
  classname?: string;
  height?: string | number;
  name?: string;
  children: React.ReactNode;
}

const SplitCardViewBottom: FC<ISplitCardViewBottom> = (props) => {
  const defaultClass = `${props.classname} rounded-t-3xl overflow-hidden p-0 bg-transparent bg-[#F2F5FA]`;

  const height = props.height ? props.height : "80%";
  return (
    <View h={height} w={"100%"} className={defaultClass}>
      <View className={`h-full w-full rounded-t-3xl  ${props.classname}`}>
        {Children.map(props.children, (child) => child)}
      </View>
    </View>
  );
};

export { SplitCardViewBottom };
