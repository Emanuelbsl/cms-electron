import {
  Anchor,
  Export,
  FileImage,
  Image,
  Images,
  MapTrifold,
} from '@phosphor-icons/react'
import React, {
  Dispatch,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import ButtonIcon from '@renderer/components/Button/Icon'
import InputFiles from '@renderer/components/Button/filesIcon'
import { Main } from '@renderer/components/MainPage'
import { v4 as uuidv4 } from 'uuid'

export type IImagens = {
  key: string
  name: string
  path: string
  x?: number
  y?: number
  h?: number
  w?: number
}

export interface IImagem {
  name: string | null | undefined
  path: string | null | undefined
}

export interface ICurrentPositions {
  key: string
  name: string
  nameImg?: string
  path: string
  x?: number
  y?: number
  h?: number
  w?: number
  index?: number
  price?: number
}

const CONTAINER_WIDTH = 1520
const CONTAINER_HEIGHT = 818

function orderByIndex(a: { index: number }, b: { index: number }) {
  return a.index - b.index
}

const order = (items: any[]) => {
  return items
    .filter((item: { index: number }) => item?.index)
    .sort(orderByIndex)
}

const removeExtension = (name: string | undefined | null): string => {
  if (!name) {
    return ''
  }
  const newName = name.split('.')[0]
  return newName.replace(/(^\w{1})|(\s+\w{1})/g, (letra) => letra.toUpperCase())
}

function getMousePosition(
  evt: React.MouseEvent<HTMLDivElement, MouseEvent>,
  screenCTM: SVGSVGElement,
) {
  const CTM = screenCTM?.getScreenCTM()

  return {
    x: (evt.clientX - CTM!.e) / CTM!.a,
    y: (evt.clientY - CTM!.f) / CTM!.d,
  }
}

function getImgSize(url: string) {
  const newImg = new window.Image()
  return new Promise((resolve, _reject) => {
    newImg.onload = function () {
      const height: number = newImg?.height
      const width: number = newImg?.width
      resolve({ width, height })
    }
    newImg.src = url
  })
}

const converte: { [key: string]: Function } = {
  number: (value: string): number => {
    return parseFloat(value)
  },
  text: (value: string): string => {
    return String(value)
  },
}

const size: { [key: string]: Function } = {
  h: (w: number, h: number, value: number): any => {
    const aspect = w / h
    const result: number = value * aspect
    // const x = (result - value) * 0.5
    // const y = (result - value) * 0.5
    return { h: value.toFixed(2), w: result.toFixed(2) }
  },
  w: (w: number, h: number, value: number): any => {
    const aspect = w / h
    const result: number = value / aspect
    return { h: result.toFixed(2), w: value.toFixed(2) }
  },
}

export function GFCreate2() {
  const canvasRef = useRef<SVGSVGElement | null>(null)
  const [imagens, setImages] = useState<IImagens[]>([])
  const [imagemMap, setImagemMap] = useState<IImagem | null>(null)
  const [imagensIndex, setImagemIndex] = useState<IImagem | null>(null)
  const [imagensAnchor, setImagemAnchor] = useState<IImagem | null>(null)
  const [currentPosition, setCurrentPosition] = useState<ICurrentPositions[]>(
    [],
  )
  const [selected, setSelected] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [open, setOpen] = useState(false)

  const finalResult = useMemo(() => {
    let txt: string = ''
    // eslint-disable-next-line array-callback-return
    currentPosition.map((position): void => {
      const positionX = position?.x || 0
      const positionY = position?.y || 0
      const x = (positionX / CONTAINER_WIDTH) * 100
      const y = (positionY / CONTAINER_HEIGHT) * 100

      const name = position?.nameImg || removeExtension(position?.name)

      txt += '[\n'
      txt += `  'name' => '${name}',\n`
      txt += `  'description' => '${position?.name}',\n`
      txt += `  'achievement_id' => $achievementId,\n`
      txt += `  'price' => 15,\n`
      txt += `  'scenario_id' => $scenario->id,\n`
      txt += `  'badge_id' => NewSceneryRepository::updateOrCreateBadge('${position?.name}', 'virtual_good', "$path/${position?.name}"),\n`
      txt += `  'x' => ${x.toFixed(2)},\n`
      txt += `  'y' => ${y.toFixed(2)},\n`
      txt += `  'width' => ${position.w},\n`
      txt += `  'height' => ${position.h},\n`
      txt += `  'zindex' => ${position?.index || 0},\n`
      txt += '],\n'
    })
    return txt
  }, [open])

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files
    if (!files || files?.length === 0) return
    const chosenFiles = Array.prototype.slice.call(files) || []
    setImages([])
    chosenFiles?.map((file: any): void => {
      const url = URL.createObjectURL(file)
      getImgSize(url).then((size) => {
        const w = size?.width || 0
        const h = size?.height || 0
        const params = {
          key: uuidv4(),
          name: file?.name,
          path: url,
          w,
          h,
        }
        setImages((prevState) => [...prevState, params])
      })
    })
  }

  const handleImgMap = (
    event: React.ChangeEvent<HTMLInputElement>,
    stateSetter: Dispatch<IImagem>,
  ) => {
    const files = event?.target?.files as FileList

    if (!files || files?.length === 0) return
    const first = files?.[0]

    stateSetter({
      name: first?.name,
      path: URL.createObjectURL(first),
    })
  }

  const itemSelected = useMemo<ICurrentPositions | null>(() => {
    return currentPosition.find((img) => img.key === selected) || null
  }, [selected, currentPosition])

  const handleUpdateParams = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const target = event?.target as HTMLInputElement

    const name = target?.name || null
    const type = target.type || 'text'
    const value = converte[type](target?.value) ?? null

    if (!name) {
      return
    }
    // const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight)

    setCurrentPosition((prevState) =>
      prevState.map((img: ICurrentPositions) => {
        // h: value / aspect
        // w: value * aspect
        if (name === 'h' || name === 'w') {
          const newSize = size[name](img?.w, img?.h, value)
          return img?.key === selected ? { ...img, ...newSize } : img
        }

        return img?.key === selected ? { ...img, [name]: value } : img
      }),
    )
  }

  // mouse move
  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      event.preventDefault()
      const screenCTM = canvasRef.current

      if (screenCTM && isDragging) {
        const coord = getMousePosition(event, screenCTM)
        setCurrentPosition((prevState) =>
          prevState.map((img: ICurrentPositions) => {
            const w: number = img.w || 0
            const h: number = img?.h || 0

            return img?.key === selected
              ? {
                  ...img,
                  x: coord.x - w / 2,
                  y: coord.y - h / 2,
                }
              : img
          }),
        )
      }
    },

    [isDragging, selected],
  )

  const handleMouseUp = useCallback(() => {
    // setSelected(null)
    setIsDragging(false)
  }, [])

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<SVGImageElement>) => {
      const target = event.target as SVGImageElement
      setSelected(target.id)
      setIsDragging(true)
    },
    [],
  )

  useEffect(() => {
    window.addEventListener('mouseup', handleMouseUp)

    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  const handleClickImagem = (key: string) => {
    const image = imagens.find((img) => img.key === key) as IImagens

    setImages((prevState) => prevState.filter((img) => img.key !== key))
    setCurrentPosition((prevState: ICurrentPositions[]) => [
      ...prevState,
      { ...image, index: 0, price: 10, nameImg: removeExtension(image?.name) },
    ])
  }

  return (
    <Main>
      <div className="flex h-full w-full flex-col">
        <div className="flex p-1 px-3 w-full bg-black border-b border-gray-500">
          <InputFiles
            onChange={handleFiles}
            icon={FileImage}
            tooltip="carregar images"
            className="p-1 pl-2 pr-2"
            multiple
          />
          <ButtonIcon
            onClick={(event: any) => console.log('CLICK', event)}
            className="p-1 pl-2 pr-2"
            icon={Images}
            disabled={!imagens.length}
          />
          <InputFiles
            onChange={(event) => handleImgMap(event, setImagemIndex)}
            icon={Image}
            tooltip="carregar imagem do index"
            className="p-1 pl-2 pr-2"
          />
          <InputFiles
            onChange={(event) => handleImgMap(event, setImagemMap)}
            icon={MapTrifold}
            tooltip="carregar imagem do map"
            className="p-1 pl-2 pr-2"
          />
          <InputFiles
            onChange={(event) => handleImgMap(event, setImagemAnchor)}
            icon={Anchor}
            tooltip="imagem para ancorar"
            className="p-1 pl-2 pr-2"
          />
          <ButtonIcon
            onClick={(event: any) => setOpen((prevOpen) => !prevOpen)}
            className="p-1 pl-2 pr-2"
            icon={Export}
            disabled={!currentPosition.length}
          />
        </div>
        <div className="flex h-full w-full p-2 gap-2">
          <div className="w-16 overflow-y-auto h-[calc(100vh-7rem)] display-no-scrollbar flex justify-start items-center flex-col bg-black p-1 border rounded-l border-gray-500">
            {imagens.map((img: { name: string; path: string; key: string }) => {
              const url = new URL(img?.path, import.meta.url).href
              return (
                <img
                  draggable={false}
                  key={img.key}
                  className="img w-full h-auto border rounded-lg border-gray-400 dark:bg-gray-700 cursor-pointer m-1 p-1 hover:dark:bg-gray-500"
                  src={url}
                  alt={img?.name}
                  onClick={() => handleClickImagem(img.key)}
                />
              )
            })}
          </div>
          <div className="flex  display-no-scrollbar flex-col justify-center items-center w-full h-[calc(100vh-7rem)] p-1 border rounded-l border-gray-500">
            <div className="relative contents w-full h-full">
              <div className="flex p-3 w-full justify-evenly h-[7%]">
                {imagemMap && (
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-10 h-10 rounded"
                      src={imagemMap?.path || ''}
                      alt={imagemMap?.name || ''}
                    />
                    <div className="font-medium dark:text-white">
                      <div>Mapa do Cenário</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {imagemMap?.name || ''}
                      </div>
                    </div>
                  </div>
                )}
                {imagensIndex && (
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-10 h-10 rounded"
                      src={imagensIndex?.path || ''}
                      alt={imagensIndex?.name || ''}
                    />
                    <div className="font-medium dark:text-white">
                      <div>Index da Tela</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {imagensIndex?.name || ''}
                      </div>
                    </div>
                  </div>
                )}
                {imagensAnchor && (
                  <div className="flex items-center space-x-4">
                    <img
                      className="w-10 h-10 rounded"
                      src={imagensAnchor?.path || ''}
                      alt={imagensAnchor?.name || ''}
                    />
                    <div className="font-medium dark:text-white">
                      <div>Ancora Tela</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {imagensAnchor?.name || ''}
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div
                onMouseMove={handleMouseMove}
                className="w-full flex overflow-hidden border rounded-l border-gray-500 h-[68%] justify-center"
              >
                <svg
                  viewBox="0 0 1520 818"
                  ref={canvasRef}
                  className="inset-0 stroke-gray-900/10 dark:stroke-san-marino-50/30"
                >
                  <defs>
                    <pattern
                      id="pattern-4d2f8758-2f66-4332-9b69-ca19e9dfc001"
                      x="0"
                      y="0"
                      width="10"
                      height="10"
                      patternUnits="userSpaceOnUse"
                    >
                      <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                    </pattern>
                  </defs>
                  <rect
                    stroke="none"
                    fill="url(#pattern-4d2f8758-2f66-4332-9b69-ca19e9dfc001)"
                    height={CONTAINER_HEIGHT}
                    width={CONTAINER_WIDTH}
                  ></rect>
                  {imagensIndex && (
                    <image
                      xlinkHref={`${imagensIndex?.path}`}
                      x="0"
                      y="0"
                      height={CONTAINER_HEIGHT}
                      width={CONTAINER_WIDTH}
                      className="rounded-sm border border-dashed border-gray-400"
                    />
                  )}
                  {imagensAnchor && (
                    <image
                      xlinkHref={`${imagensAnchor?.path}`}
                      x="0"
                      y="0"
                      height={CONTAINER_HEIGHT}
                      width={CONTAINER_WIDTH}
                      className="grayscale opacity-75"
                    />
                  )}
                  {currentPosition.map((img) => {
                    const positionX: number = img.x || 0
                    const positionY: number = img.y || 0
                    const x: number = (positionX / CONTAINER_WIDTH) * 100
                    const y: number = (positionY / CONTAINER_HEIGHT) * 100
                    return (
                      <image
                        key={img.key}
                        id={img.key}
                        xlinkHref={`${img?.path}`}
                        onMouseDown={handleMouseDown}
                        className="cursor-grab active:cursor-grabbing hover:drop-shadow-[0_0_1px_rgba(0,0,0,1)]"
                        // x={img.x?.toFixed(2)}
                        // y={img.y?.toFixed(2)}
                        x={`${x?.toFixed(2)}%`}
                        y={`${y?.toFixed(2)}%`}
                        height={img?.h}
                        width={img?.w}
                      />
                    )
                  })}
                  {order(currentPosition).map(
                    (item: { key: React.Key | null | undefined }) => (
                      <use key={item?.key} xlinkHref={`#${item?.key}`} />
                    ),
                  )}
                </svg>
              </div>
              {!!Object.keys(itemSelected || {}).length && (
                <div className="box-border p-3 h-[25%]">
                  <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div>
                      <label
                        htmlFor="website"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nome da imagem
                      </label>
                      <input
                        type="text"
                        value={
                          itemSelected?.nameImg ||
                          removeExtension(itemSelected?.name)
                        }
                        className="disabled:cursor-not-allowed block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                        name="nameImg"
                        onChange={handleUpdateParams}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="visitors"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Nome do arquivo
                      </label>
                      <input
                        type="text"
                        id="visitors"
                        value={itemSelected?.name}
                        className="disabled:cursor-not-allowed block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                        disabled
                      />
                    </div>
                  </div>
                  <div className="grid gap-6 mb-6 md:grid-cols-2">
                    <div className="grid gap-6 mb-6 md:grid-cols-4">
                      <div>
                        <label
                          htmlFor="visitors"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Posição X
                        </label>
                        <input
                          type="number"
                          id="visitors"
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={itemSelected?.x?.toFixed(2)}
                          required
                          name="x"
                          onChange={handleUpdateParams}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-[-15px] bottom-1.5">
                          -
                        </div>
                        <label
                          htmlFor="visitors"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Posição Y
                        </label>
                        <input
                          type="number"
                          id="visitors"
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={itemSelected?.y?.toFixed(2)}
                          required
                          name="y"
                          onChange={handleUpdateParams}
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="visitors"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Altura
                        </label>
                        <input
                          type="number"
                          id="visitors"
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={itemSelected?.h}
                          required
                          name="h"
                          onChange={handleUpdateParams}
                        />
                      </div>
                      <div className="relative">
                        <div className="absolute left-[-15px] bottom-1.5">
                          -
                        </div>
                        <label
                          htmlFor="visitors"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Largura
                        </label>
                        <input
                          type="number"
                          id="visitors"
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={itemSelected?.w}
                          required
                          name="w"
                          onChange={handleUpdateParams}
                        />
                      </div>
                    </div>
                    <div className="grid gap-6 mb-6 md:grid-cols-4">
                      <div>
                        <label
                          htmlFor="visitors"
                          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                          Index
                        </label>
                        <input
                          type="number"
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={itemSelected?.index || 0}
                          required
                          name="index"
                          onChange={handleUpdateParams}
                        />
                      </div>
                      <div>
                        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                          Valor $
                        </label>
                        <input
                          type="number"
                          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                          value={itemSelected?.price || 10}
                          required
                          name="price"
                          onChange={handleUpdateParams}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div
        className={`relative z-10 ${open ? 'flex' : 'hidden'}`}
        aria-labelledby="modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <div className="relative transform overflow-hidden rounded-lg bg-white dark:bg-gray-700 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
              <div className="bg-white dark:bg-gray-700 px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="w-full mt-3 text-left">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">
                      Código gerado abaixo
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-san-marino-200 leading-relaxed ">
                        Are you sure you want to deactivate your account? All of
                        your data will be permanently removed. This action
                        cannot be undone.
                      </p>
                      <pre className=" overflow-auto bg-white dark:bg-gray-900 leading-relaxed border border-san-marino-500 p-2 m-1 rounded-lg">
                        {/* <xmp>{finalResult}</xmp> */}
                        {finalResult}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  onClick={() => setOpen(false)}
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                >
                  FECHAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  )
}
