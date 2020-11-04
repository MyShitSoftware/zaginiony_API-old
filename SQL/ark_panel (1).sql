-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 04 Lis 2020, 22:01
-- Wersja serwera: 10.4.14-MariaDB
-- Wersja PHP: 7.4.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Baza danych: `ark_panel`
--

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `date` datetime NOT NULL,
  `player_server_name` varchar(64) COLLATE utf8_polish_ci NOT NULL,
  `player_discord_name` varchar(64) COLLATE utf8_polish_ci NOT NULL,
  `buy_item` int(11) NOT NULL,
  `buy_item_time` int(11) NOT NULL,
  `pay_price` int(11) NOT NULL,
  `payment_proceed` int(11) NOT NULL,
  `proceed_srv` int(11) NOT NULL,
  `proceed_dsc` int(11) NOT NULL,
  `buy_srv_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `orders`
--

INSERT INTO `orders` (`id`, `date`, `player_server_name`, `player_discord_name`, `buy_item`, `buy_item_time`, `pay_price`, `payment_proceed`, `proceed_srv`, `proceed_dsc`, `buy_srv_type`) VALUES
(1, '2020-10-30 19:02:33', 'Najsar', 'Najsar#8297', 2, 1, 19, 0, 0, 0, 1);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `servers`
--

CREATE TABLE `servers` (
  `id` int(32) NOT NULL,
  `server_ip` varchar(64) COLLATE utf8_polish_ci NOT NULL,
  `query_port` int(16) NOT NULL,
  `rcon_port` int(16) NOT NULL,
  `rcon_password` varchar(32) COLLATE utf8_polish_ci NOT NULL,
  `type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `servers`
--

INSERT INTO `servers` (`id`, `server_ip`, `query_port`, `rcon_port`, `rcon_password`, `type`) VALUES
(1, 'srv1.zaginiony-swiat.pl', 27017, 32332, 'Azorek530', 1),
(2, 'srv1.zaginiony-swiat.pl', 27018, 32333, 'Azorek530', 1),
(3, 'srv1.zaginiony-swiat.pl', 27020, 32335, 'Azorek530', 1),
(4, 'srv1.zaginiony-swiat.pl', 27030, 32000, 'Azorek530', 2),
(5, 'srv1.zaginiony-swiat.pl', 27031, 32001, 'Azorek530', 2),
(6, 'srv1.zaginiony-swiat.pl', 27032, 32002, 'Azorek530', 2),
(7, 'srv1.zaginiony-swiat.pl', 27033, 32003, 'Azorek530', 2);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `shop_items`
--

CREATE TABLE `shop_items` (
  `id` int(11) NOT NULL,
  `img` varchar(64) COLLATE utf8_polish_ci NOT NULL,
  `title` varchar(64) COLLATE utf8_polish_ci NOT NULL,
  `description` text COLLATE utf8_polish_ci NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `shop_items`
--

INSERT INTO `shop_items` (`id`, `img`, `title`, `description`, `price`) VALUES
(2, 'vip', 'VIP', '-> Kit VIP:<br>\r\nCarno 100lvl z siodłem (zielone, 25%)<br>\r\nArgenta 50lvl z siodłem (zielone, 25%)<br>\r\nTricek 50lvl z siodłem (zielone, 25%)<br>\r\nChitynowa zbroja (niebieska, 50%)<br>\r\nMetalowy kilof/siekiera/pika (niebieskie, 120%)<br>\r\nCryoPod x1<br>\r\n<br>\r\n-> 10pkt. co 30 minut<br>\r\n<br>\r\n* W bonusie chibi + 200 darmowych punktów!<br>', 19),
(3, 'svip', 'Super VIP', '-> Kit SVIP:<br>\r\nRex 200lvl z siodłem (niebieskie, 50%)<br>\r\nArgent 150lvl z siodłem (niebieskie, 50%)<br>\r\nMamut 100lvl z siodłem (niebieskie, 50%)<br>\r\nDoedi 100lvl z siodłem (niebieskie, 50%)<br>\r\nMetalowa zbroja (fioletowa, 150%)<br>\r\nMetalowy kilof/siekiera/miecz (filetowe, 150%)<br>\r\nPiła łańcuchowa + 50 paliwa<br>\r\nCryoPod x2<br>\r\n<br>\r\n-> Dostęp do działu SklepSVIP w sklepie (F2) i dodatkowych przedmiotów w tym sklepie<br>\r\n-> 20pkt. co 30 minut<br>\r\n<br>\r\n* W bonusie chibi + 550 darmowych punktów!<br>', 49),
(4, 'donator', 'Donator', '-> Kit Donator:<br>\r\nKecal 150lvl z platformą (fioletowe, 75%)<br>\r\nTerizino 180lvl z siodłem (fioletowe, 75%)<br>\r\nAnkylo 200lvl z siodłem (fioletowe, 75%)<br>\r\nZbroja prewencji (fioletowa, 200%)<br>\r\nMetal kilof/siekiera/miecz (złote, 200%)<br>\r\nCryoPod x3<br>\r\n<br>\r\n-> Dostęp do Kit VIP i Kit SVIP<br>\r\n-> Dostęp do działu SklepSVIP w sklepie (F2) i dodatkowych przedmiotów w tym sklepie<br>\r\n-> 35pkt. co 30 minut<br>\r\n<br>\r\n* W bonusie chibi + 1100 darmowych punktów!<br>', 79),
(5, 'pngkey.com-gold-coins-falling-png-1079697', '400 pkt', 'Kilka punktów na urozmaicenie gry', 19),
(6, 'pngkey.com-pile-of-gold-png-1598541', '800pkt. (W bonusie +200pkt.)', 'Trochę więcej punktów, chcę pokazać somsiadowi, że mnie stać', 39),
(7, 'pngkey.com-bag-of-gold-png-4103253', ' 1200pkt. (W bonusie +400pkt.)', 'Ogromny wór punktów, bo mnie stać', 59),
(8, 'donator', 'Donator+', '-> Otrzymuje MiningDrill\'a (legendarny, 200%)<br>\r\n-> Dostęp do wszystkiego co ma Donator<br>', 99);

-- --------------------------------------------------------

--
-- Struktura tabeli dla tabeli `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user` varchar(64) COLLATE utf8_polish_ci NOT NULL,
  `pass` varchar(64) COLLATE utf8_polish_ci NOT NULL,
  `email` varchar(64) COLLATE utf8_polish_ci NOT NULL,
  `avatar` varchar(64) COLLATE utf8_polish_ci DEFAULT NULL,
  `permission` int(11) NOT NULL,
  `steam_id` varchar(64) COLLATE utf8_polish_ci DEFAULT NULL,
  `register_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `users`
--

INSERT INTO `users` (`id`, `user`, `pass`, `email`, `avatar`, `permission`, `steam_id`, `register_date`) VALUES
(1, 'Najsar', '$2b$10$zc4rGObigXu2gRdtvfYMqu9rSJ5trwjntz28nW9EGUooAC/s/5NXO', 'najsar@zaginiony-swiat.pl', 'najsar_avatar.jpg', 10, '76561198200982485', '2020-10-28 23:12:17');

--
-- Indeksy dla zrzutów tabel
--

--
-- Indeksy dla tabeli `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `servers`
--
ALTER TABLE `servers`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `shop_items`
--
ALTER TABLE `shop_items`
  ADD PRIMARY KEY (`id`);

--
-- Indeksy dla tabeli `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT dla tabeli `servers`
--
ALTER TABLE `servers`
  MODIFY `id` int(32) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT dla tabeli `shop_items`
--
ALTER TABLE `shop_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT dla tabeli `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
