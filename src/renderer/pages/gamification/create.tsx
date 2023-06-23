import {
  Anchor,
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
  path: string
  isDragging: boolean
  x?: number
  y?: number
  h?: number
  w?: number
}

function draw(ctx, location) {
  const image = new window.Image()
  image.src = location.path
  image.onload = () => {
    ctx.beginPath()
    ctx.fillStyle = {}
    ctx.drawImage(image, location.x, location.y, location.w, location.h)
  }
}

function getImgSize(url: string, key: string) {
  const newImg = new window.Image()
  return new Promise((res, rej) => {
    newImg.onload = function () {
      const height = newImg?.height
      const width = newImg?.width
      res({ width, height })
    }
    newImg.src = url
    newImg.id = key || 'kjllk'
  })
}

export function GFCreate() {
  const canvasRef = useRef(null)
  const [imagens, setImages] = useState<IImagens[]>([])
  const [imagemMap, setImagemMap] = useState<IImagem | null>(null)
  const [imagensIndex, setImagemIndex] = useState<IImagem | null>(null)
  const [imagensAnchor, setImagemAnchor] = useState<IImagem | null>(null)
  const [currentPosition, setCurrentPosition] = useState<ICurrentPositions[]>(
    [],
  )
  const ctx = useMemo(() => {
    if (canvasRef?.current) {
      const canvasEle = canvasRef?.current
      canvasEle.width = canvasEle?.clientWidth
      canvasEle.height = canvasEle?.clientHeight

      return canvasEle.getContext('2d')
    }
    return null
  }, [canvasRef?.current])

  let isDown = false
  let dragTarget = null
  let startX = null
  let startY = null

  const handleFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event?.target?.files
    if (!files || files?.length === 0) return
    const chosenFiles = Array.prototype.slice.call(files)
    setImages([])
    setCurrentPosition([])
    chosenFiles?.map((file: any) => {
      const url = URL.createObjectURL(file)
      getImgSize(url).then((size) => {
        const params = {
          key: uuidv4(),
          name: file?.name,
          path: url,
          w: size?.width,
          h: size?.height,
          x: 0,
          y: 0,
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

  const handleClickImagem = (key: string) => {
    const image = imagens.find((img) => img.key === key)

    setImages((prevState) => prevState.filter((img) => img.key !== key))
    setCurrentPosition((prevState) => [...prevState, image])
  }

  const hitBox = (x, y) => {
    let isTarget = null
    currentPosition.map((box) => {
      if (
        x >= box.x &&
        x <= box.x + box.w &&
        y >= box.y &&
        y <= box.y + box.h
      ) {
        dragTarget = box
        isTarget = true
      }
    })

    return isTarget
  }

  const handleMouseUp = () => {
    dragTarget = null
    isDown = false
  }
  const handleMouseOut = () => {
    handleMouseUp()
  }

  const handleMouseDown = useCallback(
    (event: React.MouseEvent<HTMLCanvasElement>) => {
      const nativeEvent = event.nativeEvent as unknown as HTMLCanvasElement

      const canvasEle = canvasRef.current
      startX = parseInt(nativeEvent?.offsetX - canvasEle?.clientLeft)
      startY = parseInt(nativeEvent?.offsetY - canvasEle?.clientTop)
      isDown = hitBox(startX, startY)
    },
    [currentPosition],
  )

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const nativeEvent = event.nativeEvent as unknown as HTMLCanvasElement
    const canvasEle = canvasRef.current
    if (!isDown) return

    const mouseX = parseInt(nativeEvent?.offsetX - canvasEle.clientLeft)
    const mouseY = parseInt(nativeEvent?.offsetY - canvasEle.clientTop)
    const dx = mouseX - startX
    const dy = mouseY - startY
    startX = mouseX
    startY = mouseY
    dragTarget.x += dx
    dragTarget.y += dy

    drawUpdate()
  }

  const drawUpdate = () => {
    const canvasEle = canvasRef.current
    const width = canvasEle.clientWidth
    const height = canvasEle.clientHeight
    ctx.clearRect(0, 0, width, height)
    currentPosition.map((location) => draw(ctx, location))
  }

  useEffect(() => {
    if (ctx) {
      drawUpdate()
    }
  }, [currentPosition, ctx])

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
        </div>
        <div className="flex h-full w-full p-2 gap-2">
          <div className="w-16 overflow-y-auto h-[calc(100vh-8rem)] display-no-scrollbar flex justify-start items-center flex-col bg-black p-1 border rounded-l border-gray-500">
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
          <div className="flex items-center w-full h-auto p-1 border rounded-l border-gray-500">
            <div className="relative contents">
              <canvas
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseOut={handleMouseOut}
                onMouseMove={handleMouseMove}
                ref={canvasRef}
                width={1000}
                height={538.156}
                className="absolute"
                data-paper-resize
              />
              <svg viewBox="0 0 1520 818" width={1000} height={538.156}>
                {imagensIndex && (
                  <image
                    xlinkHref={`${imagensIndex?.path}`}
                    x="0"
                    y="0"
                    height="818"
                    width="1520"
                  />
                )}
                {imagensAnchor && (
                  <image
                    xlinkHref={`${imagensAnchor?.path}`}
                    x="0"
                    y="0"
                    height="818"
                    width="1520"
                  />
                )}
              </svg>
            </div>
          </div>
        </div>
      </div>
    </Main>
  )
}
