import { DefaultTheme, Theme } from '@react-navigation/native';

const TransparentTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: 'transparent', 
    // the background was not changing until i added this cuz the react-nav theme was not working, 
    // it just kept the default background color of the light grey on ios, until i added this
  },
};

export { TransparentTheme };