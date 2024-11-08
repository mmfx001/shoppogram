import React from 'react';

const About = () => {
  return (
    <section className="py-12 bg-gradient-to-r from-orange-200 to-yellow-200">
      <div className="container mx-auto flex flex-col px-6 md:px-12 lg:px-24">
        <h2 className="text-4xl font-extrabold text-center text-orange-600 mb-8 drop-shadow-md">
          Saytimiz haqida
        </h2>
        <p className="text-lg text-gray-700 text-center mb-10 leading-relaxed">
          Bizning platformamiz foydalanuvchilarga turli kategoriyalardagi mahsulotlarni ko'rish va buyurtma berish imkoniyatini taqdim etadi. 
          Quyida saytning qanday ishlashi haqida qisqacha ma'lumot beriladi.
        </p>

        <h3 className="text-3xl font-semibold text-orange-700 mb-6 text-center">
          Foydalanish yo'riqnomasi:
        </h3>
        <ul className="text-lg text-gray-800 list-disc list-inside mb-10 space-y-4 max-w-3xl mx-auto">
          <li>
            <strong className="text-orange-600">Berilgan Buyurtmalar:</strong> Bu tugmani bosganda foydalanuvchi o'zining allaqachon bergan buyurtmalarini ko'rishi mumkin.
          </li>
          <li>
            <strong className="text-orange-600">Buyurtmalar berish:</strong> Bu tugma orqali foydalanuvchi yangi buyurtma bera oladi.
          </li>
          <li>
            <strong className="text-orange-600">Uy:</strong> Asosiy sahifaga qaytish uchun "Uy" tugmasini bosing.
          </li>
          <li>
            <strong className="text-orange-600">Ma'lumotlar:</strong> Saytdagi qo'shimcha ma'lumotlarni olish uchun ushbu bo'limni ochishingiz mumkin.
          </li>
          <li>
            <strong className="text-orange-600">E'lonlar:</strong> Foydalanuvchilar yangi e'lonlarni ko'rishlari yoki o'z e'lonlarini joylashtirishlari mumkin.
          </li>
          <li>
            <strong className="text-orange-600">Hisob:</strong> Foydalanuvchi shaxsiy hisobini ko'rish va boshqarish uchun bu tugmani bosishi kerak.
          </li>
          <li>
            <strong className="text-orange-600">Til tanlash (O'z | Ru):</strong> Ushbu bo'limdan foydalanib, saytni o'zbek yoki rus tilida ishlatishingiz mumkin.
          </li>
          <li>
            <strong className="text-orange-600">E'lon berish:</strong> Yangi e'lon joylashtirish uchun ushbu tugmani bosing.
          </li>
        </ul>


        <div className="flex flex-col items-center gap-16 mt-8 justify-center">
          <div>
            <a href="/">
            <img 
              src="https://files.oaiusercontent.com/file-kF02oI2aV49ydhRGSEJY4OH1?se=2024-09-08T08%3A10%3A26Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D299%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D2024-09-08_12-58-24-removebg-preview.png&sig=AC%2BA/SQrdEporlG8Vy3LJ8vdFYxsa2%2BaomLExhXn7uI%3D" 
              alt="Product Categories"
              className="w-full h-full object-cover transition-transform transform hover:scale-110 duration-300"
            />
          </a>
            
          </div>
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-lg text-gray-700">
              Siz bu yerda 3 ta kategoriyani ko'rishingiz mumkin: <strong className="text-orange-600">Tortlar, Kiyimlar, Qo'lmehnatlari</strong>
            </p>
            <p className="text-lg text-gray-700">
              Agar siz <strong className="text-orange-600">To'rtlar</strong> kategoriyasini bossangiz, siz <strong className="text-orange-600">to'rt</strong> va <strong className="text-orange-600">to'rt mahsulotlari</strong>ni ko'rishingiz mumkin.
            </p>
            <p className="text-lg text-gray-700">
              Agar siz <strong className="text-orange-600">Kiyimlar</strong> kategoriyasini bossangiz, siz <strong className="text-orange-600">kiyimlar</strong>ni ko'rishingiz mumkin.
            </p>
            <p className="text-lg text-gray-700">
              Agar siz <strong className="text-orange-600">Qo'l mehnatlari</strong> kategoriyasini bossangiz, siz <strong className="text-orange-600">qo'l mehnatlari</strong>ni ko'rishingiz mumkin.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
