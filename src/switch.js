import React, { Component } from "react";
import PropTypes from "prop-types";
import { Text, TouchableWithoutFeedback, View, Animated } from "react-native";

import styles from "./styles.js";

export default class Switch extends Component {
  static propTypes = {
    defaultValue: PropTypes.bool,
    onChangeValue: PropTypes.func,
    activeText: PropTypes.string,
    inactiveText: PropTypes.string,
    fontSize: PropTypes.number,
    activeTextColor: PropTypes.string,
    inactiveTextColor: PropTypes.string,
    activeBackgroundColor: PropTypes.string,
    inactiveBackgroundColor: PropTypes.string,
    activeButtonBackgroundColor: PropTypes.string,
    inactiveButtonBackgroundColor: PropTypes.string,
    switchWidth: PropTypes.number,
    switchHeight: PropTypes.number,
    switchBorderRadius: PropTypes.number,
    switchBorderColor: PropTypes.string,
    switchBorderWidth: PropTypes.number,
    buttonWidth: PropTypes.number,
    buttonHeight: PropTypes.number,
    buttonBorderRadius: PropTypes.number,
    buttonBorderColor: PropTypes.string,
    buttonBorderWidth: PropTypes.number,
    animationTime: PropTypes.number,
    padding: PropTypes.bool,
  };

  static defaultProps = {
    defaultValue: false,
    onChangeValue: () => null,
    activeText: "",
    inactiveText: "",
    fontSize: 16,
    activeTextColor: "rgba(255, 255, 255, 1)",
    inactiveTextColor: "rgba(255, 255, 255, 1)",
    activeBackgroundColor: "rgba(50, 163, 50, 1)",
    inactiveBackgroundColor: "rgba(137, 137, 137, 1)",
    activeButtonBackgroundColor: "rgba(255, 255, 255, 1)",
    inactiveButtonBackgroundColor: "rgba(255, 255, 255, 1)",
    switchWidth: 70,
    switchHeight: 30,
    switchBorderRadius: 15,
    switchBorderColor: "rgba(0, 0, 0, 1)",
    switchBorderWidth: 0,
    buttonWidth: 25,
    buttonHeight: 25,
    buttonBorderRadius: 15,
    buttonBorderColor: "rgba(0, 0, 0, 1)",
    buttonBorderWidth: 0,
    animationTime: 150,
    padding: true,
  };

  constructor(props, context) {
    super(props, context);
    this.padding = props.padding ? 5 : 0;
    this.transformValue = props.switchWidth - props.buttonWidth - this.padding;
    this.state = {
      value: props.defaultValue,
      transformValue: new Animated.Value(
        props.value ? this.transformValue : this.padding,
      ),
      backgroundColor: new Animated.Value(props.value ? 90 : -90),
      buttonBackgroundColor: new Animated.Value(props.value ? 90 : -90),
    };
  }

  startGroupAnimations = () => {
    const { animationTime, onChangeValue } = this.props;
    this.setState({ value: !this.state.value }, () => {
      const { value } = this.state;
      Animated.parallel([
        Animated.spring(this.state.transformValue, {
          toValue: value ? this.transformValue : this.padding,
          duration: animationTime,
        }),
        Animated.timing(this.state.backgroundColor, {
          toValue: value ? 75 : -75,
          duration: animationTime,
        }),
        Animated.timing(this.state.buttonBackgroundColor, {
          toValue: value ? 75 : -75,
          duration: animationTime,
        }),
      ]).start(onChangeValue(value));
    });
  };

  render() {
    const { transformValue, backgroundColor, buttonBackgroundColor, value } =
      this.state;

    const {
      activeText,
      inactiveText,
      fontSize,
      activeTextColor,
      inactiveTextColor,
      activeBackgroundColor,
      inactiveBackgroundColor,
      activeButtonBackgroundColor,
      inactiveButtonBackgroundColor,
      switchWidth,
      switchHeight,
      switchBorderRadius,
      switchBorderColor,
      switchBorderWidth,
      buttonWidth,
      buttonHeight,
      buttonBorderRadius,
      buttonBorderColor,
      buttonBorderWidth,
    } = this.props;

    const backgroundColorValue = backgroundColor.interpolate({
      inputRange: [-90, 90],
      outputRange: [inactiveBackgroundColor, activeBackgroundColor],
    });

    const buttonBackgroundColorValue = buttonBackgroundColor.interpolate({
      inputRange: [-90, 90],
      outputRange: [inactiveButtonBackgroundColor, activeButtonBackgroundColor],
    });

    const containerHeight =
      switchHeight > buttonHeight ? switchHeight : buttonHeight;
    const containerWidth =
      switchWidth > buttonWidth ? switchWidth : buttonWidth;

    return (
      <TouchableWithoutFeedback onPress={this.startGroupAnimations}>
        <View
          style={[
            styles.container,
            {
              height: containerHeight,
              width: containerWidth,
            },
          ]}
        >
          <Animated.View
            style={[
              {
                backgroundColor: backgroundColorValue,
                height: switchHeight,
                width: switchWidth,
                borderRadius: switchBorderRadius,
                borderWidth: switchBorderWidth,
                borderColor: switchBorderColor,
                zIndex: 1,
                position: "absolute",
                top: (containerHeight - switchHeight) / 2,
                left: (containerWidth - switchWidth) / 2,
              },
            ]}
          >
            <View style={[styles.animatedContainer]}>
              {value ? (
                <View
                  style={[
                    styles.textContainer,
                    { marginRight: "auto", marginLeft: 10 },
                  ]}
                >
                  <Text
                    style={{
                      color: activeTextColor,
                      fontSize,
                    }}
                  >
                    {value ? activeText : ""}
                  </Text>
                </View>
              ) : null}

              {!value ? (
                <View
                  style={[
                    styles.textContainer,
                    { marginLeft: "auto", marginRight: 10 },
                  ]}
                >
                  <Text
                    style={{
                      color: inactiveTextColor,
                      fontSize,
                    }}
                  >
                    {value ? "" : inactiveText}
                  </Text>
                </View>
              ) : null}
            </View>
          </Animated.View>
          <Animated.View
            style={[
              {
                backgroundColor: buttonBackgroundColorValue,
                borderRadius: buttonBorderRadius,
                borderWidth: buttonBorderWidth,
                borderColor: buttonBorderColor,
                width: buttonWidth,
                height: buttonHeight,
                zIndex: 3,
                position: "absolute",
                top: (containerHeight - buttonHeight) / 2,
                left: transformValue,
              },
            ]}
          ></Animated.View>
        </View>
      </TouchableWithoutFeedback>
    );
  }
}
