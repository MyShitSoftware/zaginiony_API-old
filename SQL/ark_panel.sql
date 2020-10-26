-- phpMyAdmin SQL Dump
-- version 5.0.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Czas generowania: 26 Paź 2020, 09:29
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
(3, 'srv1.zaginiony-swiat.pl', 27019, 32334, 'Azorek530', 1),
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
  `description` varchar(256) COLLATE utf8_polish_ci NOT NULL,
  `price` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_polish_ci;

--
-- Zrzut danych tabeli `shop_items`
--

INSERT INTO `shop_items` (`id`, `img`, `title`, `description`, `price`) VALUES
(2, 'vip', 'VIP', 'Ranga VIP na serwerach', 19),
(3, 'svip', 'Super VIP', 'Ranga Super VIP na serwerach', 39),
(4, 'donator', 'Donator', 'Ranga Donator na serwerach', 99),
(5, 'pngkey.com-gold-coins-falling-png-1079697', '200 pkt', 'Kilka punktów na urozmaicenie gry', 10),
(6, 'pngkey.com-pile-of-gold-png-1598541', '500 pkt', 'Trochę więcej punktów, chcę pokazać somsiadowi, że mnie stać', 29),
(7, 'pngkey.com-bag-of-gold-png-4103253', '1000 pkt', 'Ogromny wór punktów, bo mnie stać', 49);

--
-- Indeksy dla zrzutów tabel
--

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
-- AUTO_INCREMENT dla zrzuconych tabel
--

--
-- AUTO_INCREMENT dla tabeli `servers`
--
ALTER TABLE `servers`
  MODIFY `id` int(32) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT dla tabeli `shop_items`
--
ALTER TABLE `shop_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
