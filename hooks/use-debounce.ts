import { useState, useEffect } from "react";

const UseDebounce = <T>(value: T, delay?: number): T => {
  const [debouncedValue, setDebounceValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay || 500);

    return () => {
      clearInterval(timer)
    }
  }, [value, delay])

  return debouncedValue;

};

export default UseDebounce