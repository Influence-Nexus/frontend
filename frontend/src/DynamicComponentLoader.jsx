import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCustomStates } from './CustomStates'; // Make sure this path is correct
import { componentMap } from './ComponentMap';

const DynamicComponentLoader = ({
  componentBaseDir,
  componentName,
  setHeaderShow,
}) => {
  const { currentLang } = useCustomStates(); //
  const [Component, setComponent] = useState(null);
  const params = useParams();

  useEffect(() => {
    const key = `${componentName}-${currentLang}`;
    const fallbackKey = `${componentName}-en`;

    const loaderFn = componentMap[key] || componentMap[fallbackKey];

    if (!loaderFn) {
      console.error(
        `Компонент для ключа "${key}" не найден в компонентной карте`
      );
      // eslint-disable-next-line react/display-name
      setComponent(() => () => <div>Компонент не найден.</div>);
      return;
    }

    const LoadedComponent = lazy(() =>
      loaderFn().catch((err) => {
        console.error(`Ошибка загрузки компонента "${key}"`, err);
        return {
          default: () => (
            <div>Ошибка загрузки компонента. Подробности — в консоли.</div>
          ),
        };
      })
    );

    setComponent(() => LoadedComponent);
  }, [componentName, currentLang]);

  if (!Component) return <div>Loading...</div>;

  return (
    <Suspense fallback={<div>Loading component...</div>}>
      <Component {...params} setHeaderShow={setHeaderShow} />
    </Suspense>
  );
};

export default DynamicComponentLoader;
