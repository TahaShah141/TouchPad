import { Text, TextProps } from 'react-native';

export function ThemedText(props: TextProps) {
  return <Text {...props} className={`font-sfpro ${props.className}`} />;
}
