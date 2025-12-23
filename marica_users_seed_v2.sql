-- ==========================================
-- SEED DATA UPDATE: UNITS & USERS (MARICÁ) - FIXED
-- ==========================================

-- Clean up ALL tables correctly to avoid Foreign Key errors
-- Order matters! Child tables first, then parents.
delete from public.vaccination_records;
delete from public.vaccination_patients;
delete from public.vaccines;
delete from public.maternity_visits;
delete from public.neonatal_patients;
delete from public.violence_cases;
delete from public.tb_cases;
delete from public.notification_cases;
delete from public.sinan_numbers;
delete from public.discharge_requests;
delete from public.authorization_requests;
delete from public.ambulance_missions;
delete from public.ambulances;
delete from public.bed_requests;
delete from public.beds;
delete from public.emergency_visits; -- This was causing your error!
delete from public.patients;
delete from public.profiles; -- Now we can safely delete profiles
delete from public.health_units; -- And units

-- 1. Insert Health Units (Districts I, II, III)
insert into public.health_units (name, type) values 
-- Distrito I
('ESF ACS Nathan Nogueira (Saco das Flores)', 'ESF'),
('ESF Bairro da Amizade', 'ESF'),
('ESF Central', 'ESF'),
('ESF Enfermeira Elenir Umbelino', 'ESF'),
('ESF Mumbuca', 'ESF'),
('ESF Ponta Grossa', 'ESF'),
('ESF Retiro', 'ESF'),
('ESF São José I', 'ESF'),
('ESF Ubatiba', 'ESF'),
-- Distrito II
('ESF Barra', 'ESF'),
('ESF Espraiado', 'ESF'),
('ESF Ponta Negra', 'ESF'),
('ESF Cordeirinho', 'ESF'),
('ESF Bambuí', 'ESF'),
('ESF Guaratiba', 'ESF'),
-- Distrito III
('ESF Carlos Alberto Soares de Freitas (MCMV Inoã)', 'ESF'),
('ESF Chácara de Inoã', 'ESF'),
('ESF Inoã I', 'ESF'),
('ESF Inoã II', 'ESF'),
('ESF Santa Paula', 'ESF'),
('ESF Santa Rita', 'ESF'),
('ESF São José II', 'ESF'),
('ESF Barroco', 'ESF'),
('ESF Carlos Marighella (MCMV Itaipuaçu)', 'ESF'),
('ESF Jardim Atlântico', 'ESF'),
('ESF Recanto', 'ESF'),
('ESF Milton dos Santos', 'ESF');

-- 2. Insert Users linked to Units
do $$
declare
  -- Vars for Unit IDs
  u_nathan uuid; u_amizade uuid; u_central uuid; u_elenir uuid; u_mumbuca uuid;
  u_ponta_grossa uuid; u_retiro uuid; u_sao_jose_i uuid; u_ubatiba uuid;
  u_barra uuid; u_espraiado uuid; u_ponta_negra uuid; u_cordeirinho uuid;
  u_bambui uuid; u_guaratiba uuid;
  u_mcmv_inoa uuid; u_chacara uuid; u_inoa_i uuid; u_inoa_ii uuid;
  u_santa_paula uuid; u_santa_rita uuid; u_sao_jose_ii uuid; u_barroco uuid;
  u_mcmv_itaipuacu uuid; u_jardim_atlantico uuid; u_recanto uuid;
begin
  -- Fetch IDs
  select id into u_nathan from public.health_units where name = 'ESF ACS Nathan Nogueira (Saco das Flores)';
  select id into u_amizade from public.health_units where name = 'ESF Bairro da Amizade';
  select id into u_central from public.health_units where name = 'ESF Central';
  select id into u_elenir from public.health_units where name = 'ESF Enfermeira Elenir Umbelino';
  select id into u_mumbuca from public.health_units where name = 'ESF Mumbuca';
  select id into u_ponta_grossa from public.health_units where name = 'ESF Ponta Grossa';
  select id into u_retiro from public.health_units where name = 'ESF Retiro';
  select id into u_sao_jose_i from public.health_units where name = 'ESF São José I';
  select id into u_ubatiba from public.health_units where name = 'ESF Ubatiba';
  
  select id into u_barra from public.health_units where name = 'ESF Barra';
  select id into u_espraiado from public.health_units where name = 'ESF Espraiado';
  select id into u_ponta_negra from public.health_units where name = 'ESF Ponta Negra';
  select id into u_cordeirinho from public.health_units where name = 'ESF Cordeirinho';
  select id into u_bambui from public.health_units where name = 'ESF Bambuí';
  select id into u_guaratiba from public.health_units where name = 'ESF Guaratiba';
  
  select id into u_mcmv_inoa from public.health_units where name = 'ESF Carlos Alberto Soares de Freitas (MCMV Inoã)';
  select id into u_chacara from public.health_units where name = 'ESF Chácara de Inoã';
  select id into u_inoa_i from public.health_units where name = 'ESF Inoã I';
  select id into u_inoa_ii from public.health_units where name = 'ESF Inoã II';
  select id into u_santa_paula from public.health_units where name = 'ESF Santa Paula';
  select id into u_santa_rita from public.health_units where name = 'ESF Santa Rita';
  select id into u_sao_jose_ii from public.health_units where name = 'ESF São José II';
  select id into u_barroco from public.health_units where name = 'ESF Barroco';
  select id into u_mcmv_itaipuacu from public.health_units where name = 'ESF Carlos Marighella (MCMV Itaipuaçu)';
  select id into u_jardim_atlantico from public.health_units where name = 'ESF Jardim Atlântico';
  select id into u_recanto from public.health_units where name = 'ESF Recanto';

  -- Insert Profiles
  insert into public.profiles (name, email, role, unit_id, status) values
  -- Distrito I
  ('Elziana Silva Costa', '11111111111', 'manager', u_nathan, 'active'),
  ('Erika Alves Pontes', '11111111122', 'nurse', u_amizade, 'active'),
  ('Thaís', '11111111133', 'nurse', u_central, 'active'),
  ('Erika Encarnação Arent', '11111111144', 'manager', u_elenir, 'active'),
  ('Sebastião', '11111111155', 'nurse', u_mumbuca, 'active'),
  ('Thiago', '11111111166', 'nurse', u_ponta_grossa, 'active'),
  ('Gabriella Pedro Cordeiro', '11111111177', 'nurse', u_retiro, 'active'),
  ('Fabricio Nunes', '11111111188', 'manager', u_sao_jose_i, 'active'),
  ('Camila Parreiras', '11111111199', 'manager', u_ubatiba, 'active'),
  
  -- Distrito II
  ('Vanessa Ruscy Coelho Viana', '22222222211', 'nurse', u_barra, 'active'),
  ('Leilma Trindade', '22222222222', 'nurse', u_espraiado, 'active'),
  ('Adriana Marcela', '22222222233', 'manager', u_ponta_negra, 'active'),
  ('Flavia Regina Silva de Souza', '22222222244', 'manager', u_cordeirinho, 'active'),
  ('Deborah Talha', '22222222255', 'manager', u_bambui, 'active'),
  ('Nathalia Ferreira de Souza', '22222222266', 'nurse', u_guaratiba, 'active'),
  
  -- Distrito III
  ('Priscila Marins', '33333333311', 'manager', u_mcmv_inoa, 'active'),
  ('Bruna Albuquerque Campos', '33333333322', 'manager', u_chacara, 'active'),
  ('Amanda dos Santos Lorena Soares', '33333333333', 'manager', u_inoa_i, 'active'),
  ('Maryanna Pacheco de Oliveira Correa', '33333333344', 'manager', u_inoa_ii, 'active'),
  ('Sue Ellen Soares', '33333333355', 'manager', u_santa_paula, 'active'),
  ('Danielle Rodrigues', '33333333366', 'manager', u_santa_rita, 'active'),
  ('Sidney Scheidegger Lopes', '33333333377', 'manager', u_sao_jose_ii, 'active'),
  ('Celia Cristina Guedes Brito', '33333333388', 'manager', u_barroco, 'active'),
  ('Liliane Caldas', '33333333399', 'manager', u_mcmv_itaipuacu, 'active'),
  ('Erika Amaral', '33344444411', 'manager', u_jardim_atlantico, 'active'),
  ('Vanusa Bernardo Ferreira Crespo', '33344444422', 'nurse', u_recanto, 'active');
  
end $$;
