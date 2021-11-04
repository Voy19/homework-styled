import { createElement } from "react";

const styled = (data = null) => {
  if (!data) throw new Error('Wrong extended element');
  return (options = '', ...args) => {
    return (props = {}) => {
        let result = '';
        if (typeof data == 'function') {
          result += data(props);
        }
        result += options[0];

        const checkType = (arg) => typeof arg === 'function' 
          ? checkType(arg(props))
          : arg || '';

        if (args.length) {
          result += args.map((item, index) => checkType(item) + options[index + 1]);
        }
        
        const finalResult = result.replace(/\n|\t|\,/g, '').replace(/;;/g, ';');

        const deleteDuplications = (string) => {
          const cache = {};
          const arr = [];
          const separation = string.split(';').map((style) => style.split(':'));
          if (separation.length) {
            separation.map((style) => cache[style[0]] = style[1]);
              for (let key in cache) {
                arr.push(key + ':' + cache[key]);
              }
              return arr.join(';')
          }
          return string;
        }
        const transformStringToArray = deleteDuplications(finalResult).split(';').slice(0, -1);
        const transformedToObject = transformStringToArray.reduce((acc, item) => {
          const parameter = item.split(':');
          const style = parameter[0].trim();
          const value = parameter[1].trim();
          return { ...acc, [style]: value }
        }, {});
        return createElement(data, { style: { ...transformedToObject } }, props.children);
    };
  };
}

styled.button = styled("button");
styled.a = styled("a");
styled.div = styled("div");
styled.css = styled("css");

export default styled;