package com.voyagereserv.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.voyagereserv.IntegrationTest;
import com.voyagereserv.domain.Voyageur;
import com.voyagereserv.repository.VoyageurRepository;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link VoyageurResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VoyageurResourceIT {

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_EMAIL = "AAAAAAAAAA";
    private static final String UPDATED_EMAIL = "BBBBBBBBBB";

    private static final String DEFAULT_MOT_DE_PASSE = "AAAAAAAAAA";
    private static final String UPDATED_MOT_DE_PASSE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/voyageurs";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VoyageurRepository voyageurRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVoyageurMockMvc;

    private Voyageur voyageur;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Voyageur createEntity(EntityManager em) {
        Voyageur voyageur = new Voyageur().nom(DEFAULT_NOM).email(DEFAULT_EMAIL).motDePasse(DEFAULT_MOT_DE_PASSE);
        return voyageur;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Voyageur createUpdatedEntity(EntityManager em) {
        Voyageur voyageur = new Voyageur().nom(UPDATED_NOM).email(UPDATED_EMAIL).motDePasse(UPDATED_MOT_DE_PASSE);
        return voyageur;
    }

    @BeforeEach
    public void initTest() {
        voyageur = createEntity(em);
    }

    @Test
    @Transactional
    void createVoyageur() throws Exception {
        int databaseSizeBeforeCreate = voyageurRepository.findAll().size();
        // Create the Voyageur
        restVoyageurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voyageur)))
            .andExpect(status().isCreated());

        // Validate the Voyageur in the database
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeCreate + 1);
        Voyageur testVoyageur = voyageurList.get(voyageurList.size() - 1);
        assertThat(testVoyageur.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testVoyageur.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testVoyageur.getMotDePasse()).isEqualTo(DEFAULT_MOT_DE_PASSE);
    }

    @Test
    @Transactional
    void createVoyageurWithExistingId() throws Exception {
        // Create the Voyageur with an existing ID
        voyageur.setId(1L);

        int databaseSizeBeforeCreate = voyageurRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVoyageurMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voyageur)))
            .andExpect(status().isBadRequest());

        // Validate the Voyageur in the database
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVoyageurs() throws Exception {
        // Initialize the database
        voyageurRepository.saveAndFlush(voyageur);

        // Get all the voyageurList
        restVoyageurMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(voyageur.getId().intValue())))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].email").value(hasItem(DEFAULT_EMAIL)))
            .andExpect(jsonPath("$.[*].motDePasse").value(hasItem(DEFAULT_MOT_DE_PASSE)));
    }

    @Test
    @Transactional
    void getVoyageur() throws Exception {
        // Initialize the database
        voyageurRepository.saveAndFlush(voyageur);

        // Get the voyageur
        restVoyageurMockMvc
            .perform(get(ENTITY_API_URL_ID, voyageur.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(voyageur.getId().intValue()))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.email").value(DEFAULT_EMAIL))
            .andExpect(jsonPath("$.motDePasse").value(DEFAULT_MOT_DE_PASSE));
    }

    @Test
    @Transactional
    void getNonExistingVoyageur() throws Exception {
        // Get the voyageur
        restVoyageurMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVoyageur() throws Exception {
        // Initialize the database
        voyageurRepository.saveAndFlush(voyageur);

        int databaseSizeBeforeUpdate = voyageurRepository.findAll().size();

        // Update the voyageur
        Voyageur updatedVoyageur = voyageurRepository.findById(voyageur.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedVoyageur are not directly saved in db
        em.detach(updatedVoyageur);
        updatedVoyageur.nom(UPDATED_NOM).email(UPDATED_EMAIL).motDePasse(UPDATED_MOT_DE_PASSE);

        restVoyageurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVoyageur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVoyageur))
            )
            .andExpect(status().isOk());

        // Validate the Voyageur in the database
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeUpdate);
        Voyageur testVoyageur = voyageurList.get(voyageurList.size() - 1);
        assertThat(testVoyageur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testVoyageur.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testVoyageur.getMotDePasse()).isEqualTo(UPDATED_MOT_DE_PASSE);
    }

    @Test
    @Transactional
    void putNonExistingVoyageur() throws Exception {
        int databaseSizeBeforeUpdate = voyageurRepository.findAll().size();
        voyageur.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoyageurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, voyageur.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voyageur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voyageur in the database
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVoyageur() throws Exception {
        int databaseSizeBeforeUpdate = voyageurRepository.findAll().size();
        voyageur.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoyageurMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(voyageur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voyageur in the database
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVoyageur() throws Exception {
        int databaseSizeBeforeUpdate = voyageurRepository.findAll().size();
        voyageur.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoyageurMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(voyageur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Voyageur in the database
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVoyageurWithPatch() throws Exception {
        // Initialize the database
        voyageurRepository.saveAndFlush(voyageur);

        int databaseSizeBeforeUpdate = voyageurRepository.findAll().size();

        // Update the voyageur using partial update
        Voyageur partialUpdatedVoyageur = new Voyageur();
        partialUpdatedVoyageur.setId(voyageur.getId());

        partialUpdatedVoyageur.nom(UPDATED_NOM);

        restVoyageurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoyageur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoyageur))
            )
            .andExpect(status().isOk());

        // Validate the Voyageur in the database
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeUpdate);
        Voyageur testVoyageur = voyageurList.get(voyageurList.size() - 1);
        assertThat(testVoyageur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testVoyageur.getEmail()).isEqualTo(DEFAULT_EMAIL);
        assertThat(testVoyageur.getMotDePasse()).isEqualTo(DEFAULT_MOT_DE_PASSE);
    }

    @Test
    @Transactional
    void fullUpdateVoyageurWithPatch() throws Exception {
        // Initialize the database
        voyageurRepository.saveAndFlush(voyageur);

        int databaseSizeBeforeUpdate = voyageurRepository.findAll().size();

        // Update the voyageur using partial update
        Voyageur partialUpdatedVoyageur = new Voyageur();
        partialUpdatedVoyageur.setId(voyageur.getId());

        partialUpdatedVoyageur.nom(UPDATED_NOM).email(UPDATED_EMAIL).motDePasse(UPDATED_MOT_DE_PASSE);

        restVoyageurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVoyageur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVoyageur))
            )
            .andExpect(status().isOk());

        // Validate the Voyageur in the database
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeUpdate);
        Voyageur testVoyageur = voyageurList.get(voyageurList.size() - 1);
        assertThat(testVoyageur.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testVoyageur.getEmail()).isEqualTo(UPDATED_EMAIL);
        assertThat(testVoyageur.getMotDePasse()).isEqualTo(UPDATED_MOT_DE_PASSE);
    }

    @Test
    @Transactional
    void patchNonExistingVoyageur() throws Exception {
        int databaseSizeBeforeUpdate = voyageurRepository.findAll().size();
        voyageur.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVoyageurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, voyageur.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voyageur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voyageur in the database
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVoyageur() throws Exception {
        int databaseSizeBeforeUpdate = voyageurRepository.findAll().size();
        voyageur.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoyageurMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(voyageur))
            )
            .andExpect(status().isBadRequest());

        // Validate the Voyageur in the database
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVoyageur() throws Exception {
        int databaseSizeBeforeUpdate = voyageurRepository.findAll().size();
        voyageur.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVoyageurMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(voyageur)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Voyageur in the database
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVoyageur() throws Exception {
        // Initialize the database
        voyageurRepository.saveAndFlush(voyageur);

        int databaseSizeBeforeDelete = voyageurRepository.findAll().size();

        // Delete the voyageur
        restVoyageurMockMvc
            .perform(delete(ENTITY_API_URL_ID, voyageur.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Voyageur> voyageurList = voyageurRepository.findAll();
        assertThat(voyageurList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
