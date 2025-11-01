import React, { lazy, Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCustomStates } from './CustomStates';
import { componentMap } from './ComponentMap';

const componentCache = new Map(); // 🧠 кэш компонентов

const DynamicComponentLoader = ({
  componentBaseDir,
  componentName,
  setHeaderShow,
}) => {
  const { currentLang } = useCustomStates();
  const [Component, setComponent] = useState(null);
  const params = useParams();

  const componentKey = `${componentName}-${currentLang}`;
  const fallbackKey = `${componentName}-en`;

  useEffect(() => {
    let isMounted = true;

    const key = componentMap[componentKey] ? componentKey : fallbackKey;
    const loaderFn = componentMap[key];

    if (!loaderFn) {
      console.error(`Компонент не найден для ключа "${key}"`);
      // eslint-disable-next-line react/display-name
      setComponent(() => () => <div>Компонент не найден</div>);
      return;
    }

    // 🧠 Используем кэш, если есть
    if (componentCache.has(key)) {
      setComponent(() => componentCache.get(key));
      return;
    }

    const LoadedComponent = lazy(() =>
      loaderFn().catch((err) => {
        console.error(`Ошибка загрузки компонента "${key}"`, err);
        return {
          default: () => <div>Ошибка загрузки компонента</div>,
        };
      })
    );

    // Сохраняем в кэш
    componentCache.set(key, LoadedComponent);

    if (isMounted) {
      setComponent(() => LoadedComponent);
    }

    console.log(
      '🚀 DynamicComponentLoader MOUNTED for',
      componentName,
      currentLang
    );
    return () => {
      isMounted = false;
      console.log(
        '🧹 DynamicComponentLoader UNMOUNTED for',
        componentName,
        currentLang
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [componentName, currentLang]);

  if (!Component) return <div>Loading...</div>;

  return (
    <Suspense fallback={<div>Loading component...</div>}>
      <Component {...params} setHeaderShow={setHeaderShow} />
    </Suspense>
  );
};

export default DynamicComponentLoader;
