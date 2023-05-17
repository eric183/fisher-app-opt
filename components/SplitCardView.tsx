import { Box, View } from "native-base";
import { Children, FC } from "react";

interface ISplitCardViewBottom {
  classname?: string;
  height?: string | number;
  name?: string;
  children: React.ReactNode;
}

const SplitCardViewBottom: FC<ISplitCardViewBottom> = (props) => {
  const defaultClass = `w-full rounded-t-3xl overflow-hidden p-0 bg-transparent bg-[#F2F5FA] -top-5 ${props.classname}`;

  const height = props.height ? props.height : "80%";
  return (
    <View h={height} className={defaultClass}>
      <View className={`h-full w-full rounded-t-3xl`}>
        {Children.map(props.children, (child) => child)}
      </View>
    </View>
  );
};

export { SplitCardViewBottom };
