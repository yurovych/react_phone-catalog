/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import styles from './ItemCard.module.scss';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setCurrentGadget } from '../../../features/chosenItemsSlice';
import { ButtonBack } from '../../shared/ButtonBack/ButtonBack';
import { setIsWrongParams } from '../../../features/booleanSlice';
import { CardButtonsBlock } from '../../shared/CardButtonsBlock/CardButtonsBlock';
import { ProductsSlider } from '../../shared/ProductsSlider/ProductsSlider';
import { colorHexMap } from './../../colorHexMap';
import { Loader } from '../../Loader';
import { CurrentProductSlider } from '../../shared/CurrentProductSlider/CurrentProductSlider';
import { Product } from '../../../types/Product';

export const ItemCard: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const path = location.pathname;
  const paramsObj = useParams<{ productId: string }>();
  const params = paramsObj.productId;
  let gadgetWithCamera = null;
  let gadgetWithZoom = null;

  const TITLE_FOR_SLIDER = 'You may also like';

  const listOfProducts = useAppSelector(state => state.products.objects);
  const listOfPhones = useAppSelector(state => state.phones.objects);
  const listOfTablets = useAppSelector(state => state.tablets.objects);
  const listOfAccessories = useAppSelector(state => state.accessories.objects);
  const currrentGadget = useAppSelector(
    state => state.chosenItems.currentGadget,
  );
  const currentProduct = useAppSelector(
    state => state.chosenItems.currentProduct,
  );
  const loadingStatusPhones = useAppSelector(state => state.phones.loading);
  const loadingStatusTablets = useAppSelector(state => state.tablets.loading);
  const loadingStatusAccessories = useAppSelector(
    state => state.accessories.loading,
  );

  const isWrongParams = useAppSelector(state => state.boolean.isWrongParams);
  const favoritesArray = useAppSelector(state => state.chosenItems.favorite);
  const cartArray = useAppSelector(state => state.chosenItems.cart);

  const [heartIco, setHeartIco] = useState('./icons/heart-ico.svg');
  const [isInCatr, setIsinCart] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | undefined>('');
  const [selectedCapacity, setSelectedCapacity] = useState<string | undefined>(
    '',
  );
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);

  const category = useAppSelector(
    state => state.chosenItems.currentGadget?.category,
  );

  useEffect(() => {
    setSelectedColor(currrentGadget?.color);
    setSelectedCapacity(currrentGadget?.capacity);

    if (path.includes('phones')) {
      if (listOfPhones.some(phone => phone.id === params)) {
        const neededPhone = listOfPhones.find(phone => phone.id === params);

        if (neededPhone !== undefined) {
          dispatch(setCurrentGadget(neededPhone));
          dispatch(setIsWrongParams(false));
          localStorage.setItem('currentGadget', JSON.stringify(neededPhone));
        }
      } else {
        dispatch(setIsWrongParams(true));
      }
    } else if (path.includes('tablets')) {
      if (listOfTablets.some(tablet => tablet.id === params)) {
        const neededTablet = listOfTablets.find(tablet => tablet.id === params);

        if (neededTablet !== undefined) {
          dispatch(setCurrentGadget(neededTablet));
          dispatch(setIsWrongParams(false));
          localStorage.setItem('currentGadget', JSON.stringify(neededTablet));
        }
      } else {
        dispatch(setIsWrongParams(true));
      }
    } else if (path.includes('accessories')) {
      if (listOfAccessories.some(accessory => accessory.id === params)) {
        const neededAccessory = listOfAccessories.find(
          accessory => accessory.id === params,
        );

        if (neededAccessory !== undefined) {
          dispatch(setCurrentGadget(neededAccessory));
          dispatch(setIsWrongParams(false));
          localStorage.setItem(
            'currentGadget',
            JSON.stringify(neededAccessory),
          );
        }
      } else {
        dispatch(setIsWrongParams(true));
      }
    }
  }, [
    paramsObj,
    listOfPhones,
    listOfAccessories,
    listOfTablets,
    path,
    currrentGadget,
    params,
    dispatch,
  ]);

  useEffect(() => {
    if (currentProduct !== null) {
      if (!favoritesArray.some(obj => obj.id === currentProduct.id)) {
        setHeartIco('./icons/heart-ico.svg');
      } else {
        setHeartIco('./icons/heart-red-ico.svg');
      }

      if (!cartArray.some(obj => obj.id === currentProduct.id)) {
        setIsinCart(false);
      } else {
        setIsinCart(true);
      }
    }
  }, [favoritesArray, currentProduct, cartArray]);

  const getLoader = () => {
    switch (category) {
      case 'phones':
        return loadingStatusPhones && <Loader />;
      case 'tablets':
        return loadingStatusTablets && <Loader />;
      case 'accessories':
        return loadingStatusAccessories && <Loader />;
      default:
        return;
    }
  };

  const getSuggestedProducts = () => {
    const suggestedArray: Product[] = [];

    setSuggestedProducts([]);

    while (suggestedArray.length < 12) {
      const randomIndex = Math.floor(Math.random() * listOfProducts.length);
      const randomGadget = listOfProducts[randomIndex];

      if (!suggestedArray.includes(randomGadget)) {
        suggestedArray.push(randomGadget);
      }
    }

    setSuggestedProducts(suggestedArray);
  };

  useEffect(() => {
    getSuggestedProducts();
  }, [currrentGadget]);

  if (currrentGadget) {
    const hasCamera = currrentGadget.hasOwnProperty('camera');

    if (hasCamera) {
      const gadgetString = JSON.stringify(currrentGadget);

      gadgetWithCamera = JSON.parse(gadgetString);
    }

    const hasZoom = currrentGadget.hasOwnProperty('zoom');

    if (hasZoom) {
      const gadgetString = JSON.stringify(currrentGadget);

      gadgetWithZoom = JSON.parse(gadgetString);
    }
  }

  return (
    <>
      {getLoader()}
      {!isWrongParams ? (
        <div className={styles.itemCard}>
          <div
            id="gadgetPathBlock"
            className={`${styles.itemCard__path} ${styles.path}`}
          >
            <Link className={styles.path__home} to="/">
              <img src="./icons/home-ico.svg" alt="home" />
            </Link>

            <img
              className={styles.path__arrow}
              src="./icons/arrow-right-light-ico.svg"
              alt="arrow-right"
            />

            <Link
              to={`/${currrentGadget?.category}`}
              className={styles.path__category}
            >
              {currrentGadget?.category}
            </Link>

            <img
              className={styles.path__arrow}
              src="./icons/arrow-right-light-ico.svg"
              alt="arrow-right"
            />

            <p id="pathId" className={`${styles.path__id} ${styles.idVisible}`}>
              {currrentGadget?.id}
            </p>
          </div>

          <ButtonBack />

          <section className={`${styles.itemCard__main} ${styles.main}`}>
            <h2 className={styles.main__title}>{currrentGadget?.name}</h2>

            <CurrentProductSlider gadget={currrentGadget} />

            <div
              className={`${styles.main__interaction} ${styles.interaction}`}
            >
              <p className={styles.interaction__littleTitles}>
                Available colors
              </p>
              <div className={styles.interaction__colors}>
                {currrentGadget?.colorsAvailable.map(color => {
                  const hexColor = colorHexMap[color] || '#FFFFFF';

                  return (
                    <div
                      onClick={() => setSelectedColor(color)}
                      key={color}
                      className={`${styles.interaction__colorBorder} ${selectedColor === color && styles.selectedColorStyle}`}
                    >
                      <div
                        title={color}
                        style={{ backgroundColor: hexColor }}
                        className={styles.interaction__color}
                      ></div>
                    </div>
                  );
                })}
              </div>

              <div className={styles.interaction__firstHorizontal}></div>

              <p className={styles.interaction__littleTitles}>
                Select capacity
              </p>

              <div className={styles.interaction__capacityBlock}>
                {currrentGadget?.capacityAvailable.map(capacity => (
                  <button
                    onClick={() => setSelectedCapacity(capacity)}
                    className={`${styles.interaction__capacity} ${selectedCapacity === capacity && styles.selectedCapacityStyle}`}
                    key={capacity}
                  >
                    {capacity}
                  </button>
                ))}
              </div>

              <div className={styles.interaction__secondHorizontal}></div>

              <div className={styles.interaction__priceBlock}>
                <p
                  className={styles.interaction__newPrice}
                >{`$${currrentGadget?.priceDiscount}`}</p>
                <p
                  className={styles.interaction__oldPrice}
                >{`$${currrentGadget?.priceRegular}`}</p>
              </div>

              <div className={styles.interaction__buttonsContainer}>
                <CardButtonsBlock
                  gadg={currentProduct}
                  favIco={heartIco}
                  isInBasket={isInCatr}
                  setIsInBasket={setIsinCart}
                />
              </div>

              <div className={styles.interaction__techBlock}>
                <div className={styles.interaction__tech}>
                  <p className={styles.interaction__techParameter}>Screen</p>

                  <p className={styles.interaction__techValue}>
                    {currrentGadget?.screen}
                  </p>
                </div>

                <div className={styles.interaction__tech}>
                  <p className={styles.interaction__techParameter}>
                    Resolution
                  </p>

                  <p className={styles.interaction__techValue}>
                    {currrentGadget?.resolution}
                  </p>
                </div>

                <div className={styles.interaction__tech}>
                  <p className={styles.interaction__techParameter}>Processor</p>

                  <p className={styles.interaction__techValue}>
                    {currrentGadget?.processor}
                  </p>
                </div>

                <div className={styles.interaction__tech}>
                  <p className={styles.interaction__techParameter}>RAM</p>

                  <p className={styles.interaction__techValue}>
                    {currrentGadget?.ram}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.itemCard__description}>
            <div className={styles.about}>
              <h3
                className={`${styles.about__title} ${styles.descriptionTitle}`}
              >
                About
              </h3>

              <div
                className={`${styles.about__horizontal} ${styles.horizontal}`}
              ></div>

              <div className={styles.about__blocks}>
                <p
                  className={`${styles.about__text} ${styles.drscriptionText}`}
                >
                  {currrentGadget?.description[0].text}
                </p>

                <p
                  className={`${styles.about__text} ${styles.drscriptionText}`}
                >
                  {currrentGadget?.description[1].text}
                </p>

                <p
                  className={`${styles.about__text} ${styles.drscriptionText}`}
                >
                  {currrentGadget?.description[2].text}
                </p>
              </div>
            </div>

            <div className={styles.techSpecs}>
              <h3
                className={`${styles.techSpecs__title} ${styles.descriptionTitle}`}
              >
                Tech specs
              </h3>

              <div
                className={`${styles.techSpecs__horizontal} ${styles.horizontal}`}
              ></div>

              <div className={styles.techSpecs__params}>
                <div className={styles.techSpecs__param}>
                  <p className={styles.drscriptionText}>Screen</p>

                  <p className={styles.techSpecs__paramValue}>
                    {currrentGadget?.screen}
                  </p>
                </div>

                <div className={styles.techSpecs__param}>
                  <p className={styles.drscriptionText}>Resolution</p>

                  <p className={styles.techSpecs__paramValue}>
                    {currrentGadget?.resolution}
                  </p>
                </div>

                <div className={styles.techSpecs__param}>
                  <p className={styles.drscriptionText}>Processor</p>

                  <p className={styles.techSpecs__paramValue}>
                    {currrentGadget?.processor}
                  </p>
                </div>

                <div className={styles.techSpecs__param}>
                  <p className={styles.drscriptionText}>RAM</p>

                  <p className={styles.techSpecs__paramValue}>
                    {currrentGadget?.ram}
                  </p>
                </div>

                <div className={styles.techSpecs__param}>
                  <p className={styles.drscriptionText}>Built in memory</p>

                  <p className={styles.techSpecs__paramValue}>
                    {currrentGadget?.capacity}
                  </p>
                </div>
                {gadgetWithCamera !== null && (
                  <div className={styles.techSpecs__param}>
                    <p className={styles.drscriptionText}>Camera</p>

                    <p className={styles.techSpecs__paramValue}>
                      {gadgetWithCamera.camera}
                    </p>
                  </div>
                )}

                {gadgetWithZoom !== null && (
                  <div className={styles.techSpecs__param}>
                    <p className={styles.drscriptionText}>Zoom</p>

                    <p className={styles.techSpecs__paramValue}>
                      {gadgetWithZoom.zoom}
                    </p>
                  </div>
                )}

                <div className={styles.techSpecs__param}>
                  <p className={styles.drscriptionText}>Cell</p>

                  <p className={styles.techSpecs__paramValue}>
                    {currrentGadget?.cell.join(', ')}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className={styles.itemCard__slider}>
            <ProductsSlider
              title={TITLE_FOR_SLIDER}
              gadgets={suggestedProducts}
            />
          </section>
        </div>
      ) : (
        <h3 className={styles.notFound}>Product was not found</h3>
      )}
    </>
  );
};
