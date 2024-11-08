import React from 'react'

function Footer() {
  return (
    <div>
        <div>
        <div className=" h-[300px] flex justify-center bg-orange-300 items-center">
          <div className="flex gap-[50px]">
            <div className="flex flex-col gap-[10px]">
              <p className="text-white font-medium">Mobil ilovalar</p>
              <p className="text-white font-medium">Yordam</p>
              <p className="text-white font-medium">Pulik hizmatlar</p>
              <p className="text-white font-medium">Shopogram-da biznes</p>
              <p className="text-white font-medium">Saytda reklama</p>
              <p className="text-white font-medium">Foydalanish sharlari</p>
            </div>
            <div className="flex flex-col gap-[10px]">
              <p className="text-white font-medium">Maxfiylik siyosati</p>
              <p className="text-white font-medium"></p>
              <p className="text-white font-medium">Работа</p>
              <p className="text-white font-medium">
                Qanday sotib olish va sotish
              </p>
              <p className="text-white font-medium">Kontact</p>
            </div>
            <div>
              <div className="flex gap-[12px] mt-[90px]">
                <div>
                  <img
                    className="w-[135px] h-[40px] cursor-pointer"
                    src={Play}
                    alt=""
                  />{" "}
                </div>
                <div>
                  <img
                    className="w-[135px] h-[40px] cursor-pointer"
                    src={Store}
                    alt=""
                  />
                </div>
              </div>
              <div>
                <p className="font-sans text-[11.44px] font-normal leading-[16px] text-center text-slate-300">
                  Бесплатное приложение для твоего телефона
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Footer